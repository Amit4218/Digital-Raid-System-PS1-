import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Sessions from "../models/session.model.js";
import Raid from "../models/raid.model.js";
import Crimainal from "../models/criminal.model.js";
import Licence from "../models/licence.model.js";
import HandoverRecord from "../models/handoverRecords.model.js";
import sendEmail from "../utils/nodemailer.util.js";
import Evidence from "../models/evidence.model.js";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const newSession = new Sessions({
      userId: user._id,
    });

    await newSession.save();

    const token = jwt.sign(
      {
        id: user._id,
        sessionId: newSession._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );
    res.status(200).json({
      message: "Logged In Successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  const { username, password, email, department, contactNumber, name } =
    req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      personalDetails: {
        name,
        department,
        contactNumber,
      },
    });

    await newUser.save();

    res.status(200).json({ message: "User Created Successfully", newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "User Registration Error" });
  }
});

// Update the session cordinates And Raid Coordinates with sending email

router.put("/update-cordinates", async (req, res) => {
  const { token, latitude, longitude, raidId } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!decoded.sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await Sessions.findByIdAndUpdate(
      decoded.sessionId,
      { latitude, longitude },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Also updating the raid coordinates
    const raid = await Raid.findByIdAndUpdate(
      raidId,
      {
        status: "active",
        "location.coordinates": {
          longitude,
          latitude,
        },
        actualStartDate: Date.now(),
      },
      { new: true }
    );

    if (!raid) {
      return res.status(400).json({ message: "Raid not found" });
    }

    const officer = await User.findById(raid.inchargeId);
    const admin = await User.findById(raid.raidApproved.approvedBy);

    if (!officer || !admin) {
      return res.status(404).json({ message: "User not found" });
    }

    const Emails = [officer.email, admin.email];
    const data = {
      subject: "New Raid Start Confirmation Notification",
      text: `A New Raid has Been started\n\n  RAID DETAILS : \nRaid Id: ${raidId},\n Started By : ${raid.inCharge},\n Raid Address : ${raid.location.address},\n Raid Coordinates : Latitude : ${latitude}, Longitude: ${longitude}`,
    };

    // Send emails sequentially with error handling
    for (let i = 0; i < Emails.length; i++) {
      try {
        await sendEmail(Emails[i], data);
      } catch (emailError) {
        console.error(`Failed to send email to ${Emails[i]}:`, emailError);
        // Continue sending to other emails even if one fails
      }
    }

    res.status(200).json({ message: "Coordinates updated", session });
  } catch (error) {
    console.error("Coordinates Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create Unplanned Raid

router.post("/create-raid", async (req, res) => {
  const { inChargeId, culprits, location, description, scheduledDate, userId } =
    req.body;

  try {
    // find the officer
    const user = await User.findById(inChargeId);

    if (!user) {
      return res.status(404).json({ message: "unauthorized" });
    }
    // console.log(user);

    if (!culprits || !location || !description) {
      // Validate required fields
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate culprit details
    if (!culprits.length || !culprits[0].name) {
      return res.status(400).json({ message: "Invalid culprit details" });
    }

    const newRaid = await Raid.create({
      inCharge: user.username,
      inchargeId: inChargeId,
      culprits,
      location: {
        address: location.address,
      },
      scheduledDate: scheduledDate || Date.now(),
      description,
      createdBy: userId,
    });

    const email = user.email;

    const data = {
      subject: "Raid Assignment Notification",
      text: `An Unplanned Raid has been Assigned to You\n The Raid was created By : ${userId}.\n The Raid has been scheduled for: ${newRaid.scheduledDate}\n Suspect Name : ${culprits[0].name}\n Suspect Address: ${newRaid.location.address}.\n Description : ${description}  `,
    };

    const mail = sendEmail(email, data);

    res.status(201).json({
      message: "Unplanned raid request created successfully",
      data: newRaid,
    });
  } catch (error) {
    console.error("Error creating raid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// To get name of all the raid officer

router.get("/get-all-raid-officers", async (req, res) => {
  const SECRET_ACCESS_KEY = req.headers["x-access-key"];

  try {
    if (!SECRET_ACCESS_KEY) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access key provided" });
    }

    if (SECRET_ACCESS_KEY !== process.env.SECRET_ACCESS_KEY) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid access key" });
    }

    const users = await User.find().select("-password");

    return res.status(200).json({
      message: "Data fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching raids:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get approved raid

router.post("/raid/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const raid = await Raid.findById(id);

    // let inChargeName = user.username;

    res.status(200).json({ message: "success", info: raid });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
});

//handover route

router.post("/handover/:raidId", async (req, res) => {
  const { raidId } = req.params;
  const { exhibitId, custodyChain, exhibitType, itemDescription } = req.body;

  if (
    !custodyChain ||
    !Array.isArray(custodyChain) ||
    custodyChain.length === 0
  ) {
    return res.status(400).json({
      message: "Custody chain data is required and must be an array.",
    });
  }

  try {
    const latestChain = custodyChain[custodyChain.length - 1];

    if (
      !latestChain?.digitalSignatures?.fromSignature ||
      !latestChain?.digitalSignatures?.toSignature
    ) {
      return res.status(400).json({
        message:
          "Digital signatures are required for both sender and receiver.",
      });
    }

    // Generate hashes
    const { fromHash, toHash, combinedHash } = generateSignatureHash(
      latestChain.digitalSignatures.fromSignature,
      latestChain.digitalSignatures.toSignature
    );

    const newRecord = new HandoverRecord({
      raidId,
      exhibitType,
      exhibitId,
      itemDescription,
      custodyChain: custodyChain.map((entry) => ({
        ...entry,
        digitalSignatures: {
          ...entry.digitalSignatures,
          fromSignatureHash: fromHash,
          toSignatureHash: toHash,
          signaturesHash: combinedHash, // original combined hash
        },
      })),
      notificationsSent: {
        toHead: true,
        toInCharge: true,
        toReceiver: true,
      },
    });

    await newRecord.save();

    res.status(201).json({
      success: true,
      message: "Handover record created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating handover record:", error);
    res.status(500).json({
      message: "Server error while creating handover record.",
      error: error.message,
    });
  }
});

// handover get route
router.get("/handover-records", async (req, res) => {
  const { userId } = req.query;
  
  try {
    const records = await HandoverRecord.find({
      "custodyChain.handoverFrom.userId": userId
    });
    
    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error("Error fetching user handover records:", error);
    res.status(500).json({
      message: "Failed to fetch user records",
      error: error.message
    });
  }
});

function generateSignatureHash(fromSignature, toSignature) {
  return {
    fromHash: crypto.createHash("sha256").update(fromSignature).digest("hex"),
    toHash: crypto.createHash("sha256").update(toSignature).digest("hex"),
    combinedHash: crypto
      .createHash("sha256")
      .update(`${fromSignature}:${toSignature}`)
      .digest("hex"),
  };
}

// To get all raids

router.get("/get-all-raids", async (req, res) => {
  const SECRET_ACCESS_KEY = req.headers["x-access-key"];

  try {
    if (!SECRET_ACCESS_KEY) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No access key provided" });
    }

    if (SECRET_ACCESS_KEY !== process.env.SECRET_ACCESS_KEY) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid access key" });
    }

    const raids = await Raid.find();

    res.status(200).json({
      message: "Data fetched successfully",
      raids,
    });
  } catch (error) {
    console.error("Error fetching officers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Logout Route
router.post("/logout", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await Sessions.findOne({ _id: decoded.sessionId });

    if (session) {
      session.loggedOutAt = new Date();
      await session.save();
    } else {
      return res.status(400).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Logged Out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Logout error", error: error.message });
  }
});

// Evidence Route

router.post("/save-record", async (req, res) => {
  const { exhibitType, description, images, raidId, userId } = req.body;

  try {
    if (!exhibitType || !description || !images || !raidId || !userId) {
      return res.status(400).json({ message: "Data not found" });
    }

    const raid = await Raid.findById(raidId);
    const user = await User.findById(userId);

    if (!raid || !user) {
      return res.status(400).json({ message: "unauthorized" });
    }

    const exhibitId = crypto
      .createHash("sha256")
      .update(`${images}${raidId}${userId}${Date.now()}`)
      .digest("hex");

    const imageHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(`${images}${Date.now()}`))
      .digest("hex");

    // Fix the structure to match schema requirements
    const evidence = await Evidence.create({
      raidId,
      exhibitType,
      exhibitId,
      description,
      seizedBy: raid.inCharge,
      locationSeized: {
        coordinates: {
          latitude: raid.location.coordinates.latitude,
          longitude: raid.location.coordinates.longitude,
        },
      },
      mediaFiles: {
        images: {
          fileUrl: Array.isArray(images)
            ? images.map((img) => img.url)
            : [images.url],
          originalName: Array.isArray(images)
            ? images.map((img) => img.name)
            : [images.name],
          hash: imageHash,
        },
        metadata: {
          // This needs to be inside mediaFiles
          latitude: raid.location.coordinates.latitude,
          longitude: raid.location.coordinates.longitude,
          timestamp: new Date(),
          deviceInfo: null,
        },
        uploadedAt: new Date(),
      },
      currentHolder: raid.inCharge, // Make sure this is the ObjectId, not the name
    });

    res.status(200).json({ message: "Success", evidence });
  } catch (error) {
    console.error("Error saving evidence:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message, // Only send error message in development
    });
  }
});

//put request to update currentholder
router.put("/update-current-holder/:evidenceId", async (req, res) => {
  const { evidenceId } = req.params;
  const { currentHolder } = req.body;
  try {
    if (!evidenceId) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    const evidence = await Evidence.findByIdAndUpdate(
      evidenceId,
      {
        currentHolder: currentHolder,
      },
      { new: true }
    );
    if (!evidence) {
      return res.status(400).json({ message: "Evidence dosent exists" });
    }
    res.status(200).json({ message: "Success", data: evidence });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
});

router.post("/confirm-raid", async (req, res) => {
  const { crimainalId, licenceId, evidenceId, raidId, writtenReport } =
    req.body;

  console.log(crimainalId, licenceId, evidenceId, raidId);

  try {
    if (!evidenceId || !raidId) {
      return res.status(400).json({ message: "Invalid Data" });
    }

    const criminal = await Crimainal.findById(crimainalId);

    const licence = await Licence.findById(licenceId);

    const raid = await Raid.findByIdAndUpdate(raidId, {
      status: "completed",
      evidenceId,
      writtenReport,
      actualEndDate: Date.now(),
      licence: {
        holderName: licence.licenceHolder || null,
        licenceId: licence.licenceId || null,
      },
      $set: {
        "culprits.$[].identification": criminal.criminalId || null,
      },
    });

    const officer = await User.findById(raid.inchargeId);
    const admin = await User.findById(raid.unplannedRequestDetails.approvedBy);

    if (!officer || !admin) {
      return res.status(404).json({ message: "User not found" });
    }

    const Emails = [officer.email, admin.email];
    console.log(Emails);

    const data = {
      subject: "Raid Completation Notification",
      text: `A Raid has successfully completed \n\nRaid Details :\n Raid Id: ${raidId},\n Started By : ${raid.inCharge},\n Raid Address : ${raid.location.address},\n Raid Coordinates : Latitude : ${raid.location.coordinates.latitude}, Longitude: ${raid.location.coordinates.longitude}\n Raid Started At : ${raid.actualStartDate},\n Raid Completed at : ${raid.actualEndDate}`,
    };

    // Send emails sequentially with error handling
    for (let i = 0; i < Emails.length; i++) {
      try {
        const mail = await sendEmail(Emails[i], data);

        // console.log(mail);
      } catch (emailError) {
        console.error(`Failed to send email to ${Emails[i]}:`, emailError);
        // Continue sending to other emails even if one fails
      }
    }

    res.status(200).json({ message: "Raid Completed", raid });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Something went wrong" });
  }
});

// This will help update the video inf updates

router.post("/video-update-record", async (req, res) => {
  const { evidenceId, video } = req.body;

  try {
    if (!evidenceId || !video) {
      return res
        .status(400)
        .json({ message: "Evidence ID and video required" });
    }

    const videoHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(`${video.url}${Date.now()}`))
      .digest("hex");

    const updatedEvidence = await Evidence.findByIdAndUpdate(
      evidenceId,
      {
        "mediaFiles.videos.fileUrl": video.url,
        "mediaFiles.videos.originalName": video.name,
        "mediaFiles.videos.hash": videoHash,
      },
      { new: true }
    );

    res.status(200).json({ message: "Success", updatedEvidence });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving video", error: error.message });
  }
});

router.get("/download/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    console.log("Requested file:", filename); // Debug log

    const safeFilename = path.basename(filename);
    const currentFilePath = new URL(import.meta.url).pathname;
    const currentDir = path.dirname(currentFilePath);
    const fileLocation = path.join(currentDir, "../uploads", safeFilename);

    console.log("Looking for file at:", fileLocation); // Debug log

    await fs.access(fileLocation);
    res.download(fileLocation);
  } catch (error) {
    console.error("File download error:", error);
    res.status(404).json({ message: "File not found" });
  }
});
// -------------------  Please Make Temporary routes below here ----------------- //

// create criminal

router.post("/criminal", async (req, res) => {
  const { criminalId, criminalName, pastRecords } = req.body;

  if (!criminalId || !criminalName || !pastRecords) {
    return res
      .status(400)
      .json({ message: "Missing or invalid required fields" });
  }

  try {
    const criminal = await Crimainal.create({
      criminalId,
      criminalName,
      pastRecords,
    });

    res
      .status(201)
      .json({ message: "Criminal created successfully", criminal });
  } catch (error) {
    console.error("Error creating criminal:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get crimals by id

router.get("/search-criminal/:criminalId", async (req, res) => {
  const { criminalId } = req.params;

  try {
    if (!criminalId) {
      return res.status(400).json({ message: "please provide criminalId !" });
    }

    const criminal = await Crimainal.findOne({ criminalId });

    if (!criminal) {
      res.status(400).json({ message: "The criminal dosen't exist in the DB" });
    }

    res.status(200).json({ message: "success", criminal: { criminal } });
  } catch (error) {
    // console.error("criminal route error", error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// create Licence // This is also a temporary route

router.post("/create-licence", async (req, res) => {
  const {
    licenceId,
    licenceHolder,
    licenceFor,
    licenceRenewalDate,
    licencePublishDate,
  } = req.body;

  try {
    if (
      !licenceHolder ||
      !licenceFor ||
      !licenceRenewalDate ||
      !licencePublishDate ||
      !licenceId
    ) {
      return res.status(400).json({ message: "please fill all the feilds" });
    }

    const licence = await Licence.create({
      licenceId,
      licenceHolder,
      licenceFor,
      licenceRenewalDate,
      licencePublishDate,
    });

    res.status(200).json({ message: "Created", licence });
  } catch (error) {
    console.error("Licence", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get Licence // This is also a temporary route

router.get("/licence/:licenceId", async (req, res) => {
  const { licenceId } = req.params;

  try {
    if (!licenceId) {
      return res.status(400).json({ message: "Please provide licenceId!" });
    }

    const licence = await Licence.findOne({ licenceId });

    if (!licence) {
      return res
        .status(400)
        .json({ message: "The licence doesn't exist in the DB" });
    }

    return res.status(200).json({ message: "success", licence });
  } catch (error) {
    console.error("Licence route error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

//get all evidence having same raidId
router.get("/evidence/:raidId", async (req, res) => {
  const { raidId } = req.params;

  try {
    if (!raidId) {
      return res.status(400).json({ message: "Please provide raidId!" });
    }

    const evidence = await Evidence.find({ raidId });

    if (!evidence) {
      return res
        .status(400)
        .json({ message: "The evidence doesn't exist in the DB" });
    }

    return res.status(200).json({ message: "success", evidence });
  } catch (error) {
    console.error("Evidence route error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
