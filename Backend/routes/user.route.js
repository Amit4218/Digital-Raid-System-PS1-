import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Sessions from "../models/session.model.js";
import Raid from "../models/createRaid.model.js";

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

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

    res.status(200).json({ message: "Logged In Successfully", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: "User Created Successfully" });
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
  const { raidOfficer, culpritName, address, raidDate, description, raidType } =
    req.body;

  try {
    if (!raidOfficer || !culpritName || !address || !description) {
      return res.status(400).json({ message: "Please fill all the feilds" });
    }

    const newRaid = await Raid.create({
      raidOfficer,
      culpritName,
      address,
      raidType,
      raidDate: raidDate ? raidDate : Date.now(),
      description,
    });

    await newRaid.save();

    res.status(200).json({
      message: "Unplanned raiad created successfully",
    });
  } catch (error) {
    console.error("Error in Create Unplanned Raid");
    res.status(500).json({ message: "Internal server Error" });
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

    res.status(200).json({ message: "success", info: { raid } });
  } catch (error) {
    return res.status(500).json({ message: "something wen wrong" });
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

export default router;
