import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Raid from "../models/raid.model.js";
import User from "../models/user.model.js"
import Sessions from "../models/session.model.js";
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

    res.status(200).json({ message: "Logged In Successfully", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// create a new planned raid

router.post("/createRaid", async (req, res) => {
  const {
    raidType,
    createdBy,
    inCharge,
    culprits,
    location, // Expecting location object
    description,
    isUnplannedRequest,
    unplannedRequestDetails,
    warrant,
  } = req.body;

  try {
    // Prepare location object with null coordinates if not provided
    const raidLocation = {
      address: location.address,
      coordinates: location.coordinates || {
        longitude: null,
        latitude: null,
      },
    };

    const raid = new Raid({
      raidType,
      status: "pending",
      createdBy,
      inCharge,
      culprits,
      location: raidLocation,
      description,
      scheduledDate: new Date(),
      isUnplannedRequest: isUnplannedRequest || false,
      unplannedRequestDetails: isUnplannedRequest
        ? unplannedRequestDetails
        : null,
      warrant: warrant || null,
    });

    await raid.save();
    res.status(201).json({ message: "Raid created successfully", raid });
  } catch (error) {
    console.error("Error creating raid:", error);
    res.status(500).json({
      message: "Error creating raid",
      error: error.message,
      details: error.errors,
    });
  }
});




//raid data fetch route for heatmap

router.get("/heatmap", async (req, res) => {
  try {
    const raids = await Raid.find({ status: "completed_approved" });
    console.log("Fetched raids:", raids); // Log raw data

    if (!raids || raids.length === 0) {
      return res.status(404).json({ message: "No raids found" });
    }

    // Log first raid's structure to debug
    // console.log("Sample raid structure:", raids[0]);
    console.log(raids[0]?.location);
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



export default router;
