import mongoose from "mongoose";

const createRaidSchema = new mongoose.Schema(
  {
    raidOfficer: {
      type: String,
      required: true,
    },
    culpritName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    raidType: {
      type: String,
      enum: ["planned", "unplanned"],
      required: true,
    },
    raidDate: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
      required: true,
    },
    writtenReport: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    approvel: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "active", "complete"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Raid = mongoose.model("raid", createRaidSchema);

export default Raid;
