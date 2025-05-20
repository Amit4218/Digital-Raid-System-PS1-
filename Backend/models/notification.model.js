import mongoose from "mongoose";

const notificationsSent = new moongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ["raid", "handover"],
        default: "raid",
      },
      id: {
        type: String,
        required: true,
      }, // 'raid', 'handover', etc.
      // Reference to relevant document
    },
    isSent: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    priority: {
      type: [String],
      enum: ["high", "medium", "low"],
      default: "medium",
    }, // 'high', 'medium', 'low'
  },
  { timestamps: true }
);

const NotificationsSent = moongoose.model(
  "notificationsSent",
  notificationsSent
);

export default NotificationsSent;
