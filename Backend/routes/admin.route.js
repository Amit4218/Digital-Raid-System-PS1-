import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Raid from "../models/raid.model.js";
import User from "../models/user.model.js";
import Sessions from "../models/session.model.js";
import AuditLog from "../models/auditLogs.model.js";
import Fine from "../models/fine.model.js";
import HandoverRecord from "../models/handoverRecords.model.js";
import upload from "../config/multer.config.js";
import sendEmail from "../utils/nodemailer.util.js";
import Evidence from "../models/evidence.model.js";
import BlackListedToken from "../models/blackList.model.js";
import crypto from "crypto";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "head_official") {
      return res.status(400).json({ message: "Unauthorized" });
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

    res.status(200).json({ message: "Logged In Successfully", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// create a new planned raid

router.post("/create-raid", async (req, res) => {
  const {
    inCharge,
    culprits,
    location,
    description,
    scheduledDate,
    adminId,
    warrant,
  } = req.body;

  try {
    // find the officer
    const user = await User.findById(inCharge);

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

    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "unauthorized" });
    }

    const newRaid = await Raid.create({
      raidType: "planned",
      inCharge: user.username,
      inchargeId: user._id,
      culprits: [
        {
          name: culprits[0].name,
          identification: culprits[0].identification,
        },
      ],
      warrant: {
        fileUrl: warrant,
        hash: crypto.createHash("sha256").update(`${warrant}`).digest("hex"),
        uploadedAt: Date.now(),
      },
      isUnplannedRequest: false,
      location: {
        address: location.address,
      },
      scheduledDate: scheduledDate || Date.now(),
      description,
      createdBy: adminId,
      unplannedRequestDetails: {
        approvedBy: adminId,
        email: admin.email,
        approvalStatus: "approved",
        approvalDate: Date.now(),
      },
      raidApproved: {
        isApproved: true,
        approvedBy: adminId,
        raidHash: crypto
          .createHash("sha256")
          .update(`${warrant}`)
          .digest("hex"),
        approvalDate: Date.now(),
      },
    });

    const Emails = [admin.email, admin.email];
    // console.log(Emails);

    const data = {
      subject: "Raid Assignment Notification",
      text: `An Planned Raid has been Registered \n The Raid was created By : ${adminId}.\n The Raid has been scheduled for: ${newRaid.scheduledDate}\n Suspect Name : ${culprits[0].name}\n Suspect Address: ${newRaid.location.address}.\n Description : ${description}  `,
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

    res.status(201).json({
      message: "Unplanned raid request created successfully",
      data: newRaid,
    });
  } catch (error) {
    console.error("Error creating raid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update unplanned raid
router.put("/update-unplanned-request/:raidId", async (req, res) => {
  const { raidId } = req.params;
  const { approvedBy, approvalStatus, approvalDate, warrant } = req.body;

  try {
    // Validate input
    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const raid = await Raid.findByIdAndUpdate(raidId, {
      warrant: {
        fileUrl: warrant.fileUrl,
        hash: crypto.createHash("sha256").update(String(warrant)).digest("hex"),
        uploadedAt: Date.now(),
      },
      raidApproved: {
        isApproved: true,
        approvedBy,
        approvalDate: approvalDate,
      },
      unplannedRequestDetails: {
        approvalStatus: approvalStatus,
        approvedBy,
      },
    });

    res.status(200).json({
      message: "Unplanned raid request updated successfully",
      data: raid,
    });
  } catch (error) {
    console.error("Error updating unplanned raid request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all evidence of the raid

router.post("/raid-evidence/:raidId", async (req, res) => {
  const { raidId } = req.params;

  try {
    if (!raidId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const raid = await Raid.findById(raidId);

    if (!raid) {
      return res.status(400).json({ message: "Raid dosent exists" });
    }

    const evidence = await Evidence.find({ raidId: raidId });

    // if (!evidence) {
    //   return res.status(400).json({ message: "Evidence Dosent exists" });
    // }

    res.status(200).json({ message: "Success", data: { raid, evidence } });
  } catch (error) {
    res.status(500).json({ message: error?.message });
  }
});

// Create an audit log entry
router.post("/audit-log", async (req, res) => {
  try {
    const {
      action,
      performedBy,
      targetId,
      targetType,
      changes,
    } = req.body;

    if (!action || !performedBy) {
      return res.status(400).json({ message: "action and performedBy are required" });
    }

    const newLog = new AuditLog({
      action,
      performedBy,
      targetId,
      targetType,
      changes,
    });

    await newLog.save();

    res.status(201).json({
      success: true,
      message: "Audit log created successfully",
      data: newLog,
    });
  } catch (error) {
    console.error("Error creating audit log:", error);
    res.status(500).json({
      message: "Server error while creating audit log",
      error: error.message,
    });
  }
});

// Fetch audit logs, optionally filtered by targetId or performedBy
router.get("/audit-logs", async (req, res) => {
  try {
    const { targetId, performedBy } = req.query;

    const filter = {};
    if (targetId) filter.targetId = targetId;
    if (performedBy) filter.performedBy = performedBy;

    const logs = await AuditLog.find(filter)
      .populate("performedBy", "name email")  // populate user name, email for convenience
      .sort({ performedAt: -1 });             // most recent first

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      message: "Server error while fetching audit logs",
      error: error.message,
    });
  }
});

//fetch all fine data
router.get("/fines-data", async (req, res) => {
  try {
    const fines = await Fine.find()
      .populate("raidId") // Populate raid data if needed
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: fines.length,
      data: fines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// To get name of all the raid officer

router.get("/get-raid-officers", async (req, res) => {
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

//raid data fetch route for heatmap

router.get("/heatmap", async (req, res) => {
  try {
    const raids = await Raid.find({ status: "completed_approved" });
    //console.log("Fetched raids:", raids); // Log raw data

    if (!raids || raids.length === 0) {
      return res.status(404).json({ message: "No raids found" });
    }

    // Log first raid's structure to debug
    // console.log("Sample raid structure:", raids[0]);
    // console.log(raids[0]?.location);
    const heatmapData = raids.map((raid) => ({
      address: raid.location?.address || "Unknown",
      culpritName: raid.culprits?.[0]?.name || "Unknown",
      description: raid.description,
      long: raid.location?.coordinates?.longitude ?? null,
      lat: raid.location?.coordinates?.latitude ?? null,
    }));

    res.status(200).json({ heatmapData });
  } catch (error) {
    console.error("Error in /heatmap:", error); // Detailed error log
    res.status(500).json({ message: error.message });
  }
});

//raid data for graph
router.get("/statusData", async (req, res) => {
  try {
    const raids = await Raid.find({}, { _id: 1, status: 1, date: 1 }); // Adjust 'date' field name if needed

    if (!raids || raids.length === 0) {
      return res.status(404).json({ message: "No raids found" });
    }

    res.status(200).json({ statusData: raids });
  } catch (error) {
    console.error("Error in /statusData:", error);
    res.status(500).json({ message: error.message });
  }
});

// To get all the raids
router.get("/getRaids", async (req, res) => {
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
    // console.log(raids);
    res.status(200).json({
      message: "Data fetched successfully",
      raids,
    });
  } catch (error) {
    console.error("Error fetching officers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Warent Upload route / function

router.post("/upload-warrant", upload.single("warrant"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = `/uploads/${req.file.filename}`;
  console.log("File uploaded:", req.file);

  res.status(200).json({
    message: "File uploaded successfully!",
    filePath: filePath,
    fileName: req.file.filename,
  });
});

// PUT route to approve a completed raid
router.put("/raid-approve/:id", async (req, res) => {
  try {
    const raidId = req.params.id;
    const { approvedBy } = req.body; // Expecting approvedBy user ID in request body

    // Validate input
    if (!approvedBy) {
      return res.status(400).json({ message: "approvedBy is required" });
    }

    // Find the raid
    const raid = await Raid.findById(raidId);

    if (!raid) {  
      return res.status(404).json({ message: "Raid not found" });
    }

    // Check if raid is in 'completed' status
    if (raid.status !== "completed") {
      return res.status(400).json({
        message: "Raid must be in 'completed' status to be approved",
      });
    }

    // Generate a hash using important raid parameters
    const hashData = {
      raidId: raid._id.toString(),
      createdBy: raid.createdBy.toString(),
      inchargeId: raid.inchargeId.toString(),
      evidenceId: raid.evidenceId?.toString() || "no_evidence",
      description: raid.description,
      actualStartDate: raid.actualStartDate?.toISOString() || "no_start_date",
      actualEndDate: raid.actualEndDate?.toISOString() || "no_end_date",
      culpritsCount: raid.culprits.length,
      location: raid.location.address,
      status: "completed_approved",
      timestamp: new Date().toISOString(),
      approvedBy: approvedBy,
    };

    // Convert the hash data to a string and create a hash
    const hashString = JSON.stringify(hashData);
    const raidHash = crypto
      .createHash("sha256")
      .update(hashString)
      .digest("hex");

    // Update the raid
    const updatedRaid = await Raid.findByIdAndUpdate(
      raidId,
      {
        status: "completed_approved",
        raidApproved: {
          isApproved: true,
          approvedBy: approvedBy,
          raidHash: raidHash,
          approvalDate: new Date(),
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Raid approved successfully",
      raid: updatedRaid,
    });
  } catch (error) {
    console.error("Error approving raid:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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

    await BlackListedToken.create({
      token,
    });

    res.status(200).json({ message: "Logged Out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Logout error", error: error.message });
  }
});

export default router;
