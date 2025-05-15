import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Raid from "../models/raid.model.js";

const router = express.Router();

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

export default router;
