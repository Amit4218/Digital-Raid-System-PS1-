import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Raid from "../models/raid.model.js";
import User from "../models/user.model.js";
import Sessions from "../models/session.model.js";
import AuditLog from "../models/auditLogs.model.js";
import HandoverRecord from "../models/handoverRecords.model.js";
// import crypto from "crypto";


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


//update unplanned raid
router.put("/update-unplanned-request/:raidId", async (req, res) => {
  const { raidId } = req.params;
  const { approvedBy, approvalStatus, approvalDate, rejectionReason } =
    req.body;

  try {
    // Validate input
    if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }

    const updatePayload = {
      "unplannedRequestDetails.approvalStatus": approvalStatus,
      "unplannedRequestDetails.approvedBy": approvedBy || null,
      "unplannedRequestDetails.approvalDate":
        approvalStatus === "approved" ? approvalDate || new Date() : null,
      "unplannedRequestDetails.rejectionReason":
        approvalStatus === "rejected"
          ? rejectionReason || "Not specified"
          : null,
    };

    const updatedRaid = await Raid.findByIdAndUpdate(
      raidId,
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedRaid) {
      return res.status(404).json({ message: "Raid not found" });
    }

    res.status(200).json({
      message: "Unplanned raid request updated successfully",
      data: updatedRaid,
    });
  } catch (error) {
    console.error("Error updating unplanned raid request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//creating logs report

router.post("/create-log", async (req, res) => {
  try {
    const { action, performedBy, referenceId } = req.body;

    if (!action || !performedBy || !referenceId) {
      return res.status(400).json({
        error: "action, performedBy, and referenceId are required.",
      });
    }

    let changes = [];

    // Handle each action type
    switch (action) {
      case "raid_created":
      case "raid_submitted":
      case "raid_approved": {
        const raid = await Raid.findById(referenceId).lean();
        if (!raid) {
          return res.status(404).json({ error: "Raid not found." });
        }

        changes = [
          { field: "raidId", oldValue: null, newValue: raid._id },
          { field: "status", oldValue: null, newValue: raid.status || action },
          {
            field: "location",
            oldValue: null,
            newValue: raid.location || null,
          },
          {
            field: "officerInCharge",
            oldValue: null,
            newValue: raid.inCharge || null,
          },
        ];
        break;
      }

      case "handover_log": {
        const handover = await HandoverRecord.findById(referenceId)
          .populate("raidId")
          .populate("exhibitIds")
          .populate("handoverFrom")
          .populate("handoverTo.userId")
          .lean();

        if (!handover) {
          return res.status(404).json({ error: "Handover record not found." });
        }

        changes = [
          { field: "raidId", oldValue: null, newValue: handover.raidId?._id },
          {
            field: "exhibitIds",
            oldValue: null,
            newValue: handover.exhibitIds,
          },
          {
            field: "handoverFrom",
            oldValue: null,
            newValue: handover.handoverFrom?._id,
          },
          {
            field: "handoverTo",
            oldValue: null,
            newValue: handover.handoverTo?.userId
              ? handover.handoverTo.userId?._id
              : handover.handoverTo.externalDetails,
          },
          { field: "purpose", oldValue: null, newValue: handover.purpose },
          { field: "quantity", oldValue: null, newValue: handover.quantity },
        ];
        break;
      }

      default:
        return res.status(400).json({ error: "Invalid action type." });
    }

    const auditLog = new AuditLog({
      action,
      performedBy,
      changes,
    });

    await auditLog.save();
    return res
      .status(201)
      .json({ message: "Audit log created successfully", auditLog });
  } catch (error) {
    console.error("Audit log error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

export default router;
