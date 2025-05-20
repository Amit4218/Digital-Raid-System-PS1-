import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    exhibitType: {
      type: String,
      enum: ["item", "document", "digital", "others"],
      default: "Not Selected",
    },
    exhibitId: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seizedBy: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    seizureDate: {
      type: Date,
      default: Date.now,
    },
    locationSeized: {
      coordinates: {
        longitude: {
          type: String,
          required: true,
        },
        latitude: {
          type: String,
          required: true,
        },
      },
    },
    mediaFiles: {
      images: {
        fileUrl: {
          type: [String],
          required: true,
        },
        originalName: {
          type: [String],
          required: true,
        },
        hash: {
          type: String,
          default: null,
        },
      },
      videos: {
        fileUrl: {
          type: [String],
          required: true,
        },
        originalName: {
          type: [String],
          required: true,
        },
        hash: {
          type: String,
          default: null,
        },
      },
      metadata: {
        latitude: {
          type: String,
          required: true,
        },
        longitude: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: null,
        },
        deviceInfo: {
          type: String,
          default: null,
        },
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    currentHolder: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    isDisposed: {
      type: Boolean,
      default: false,
    },
    disposalDetails: {
      method: {
        type: String,
        default: null,
      },
      disposedBy: {
        type: mongoose.Schema.ObjectId,
        default: null,
      },
      disposalDate: {
        type: Date,
        default: null,
      },
      authorization: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Evidence = mongoose.model("evidence", evidenceSchema);
export default Evidence;
