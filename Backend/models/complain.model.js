import mongoose from "mongoose";

const complain = mongoose.Schema(
  {
    complaintType: {
      type: String,
      enum: ["drug", "liquor"],
      required: true,
    },
    transportMode: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: null,
    },
    videos: {
      type: [String],
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Complain = mongoose.model("complain", complain);

export default Complain;
