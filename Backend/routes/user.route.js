import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Sessions from "../models/session.model.js";
import Raid from "../models/raid.model.js";
import Crimainal from "../models/criminal.model.js";
import Licence from "../models/licence.model.js";

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

// Update the session cordinates

router.put("/update-cordinates", async (req, res) => {
  const { token, latitude, longitude } = req.body;

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    res.status(200).json({ message: "Coordinates updated", session });
  } catch (error) {
    console.error("Coordinates Update Error:");
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
    console.log(user);

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

export default router;
