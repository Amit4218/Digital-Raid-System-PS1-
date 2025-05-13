import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loggedInAt: {
      type: Date,
      default: Date.now,
    },
    loggedOutAt: {
      type: Date,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Sessions = mongoose.model("sessions", sessionSchema);

export default Sessions;
