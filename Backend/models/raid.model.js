import mongoose from "mongoose";

const raidSchema = new mongoose.Schema(
  {
    raidType: {
      type: [String],
      enum: ["planned", "unplanned"],
      required: true,
    }, // 'planned' or 'unplanned'
    status: {
      type: [String],
      enum: ["pending", "active", "completed"],
      required: true,
    }, // 'pending', 'active', 'completed', 'completed_approved'
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users (head official)
    inCharge: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users (raid officer)
    culprits: [
      {
        name: {
          type: String,
          required: true,
        },
        identification: {
          type: Number,
          required: true,
        }, // ID number or other identifier
        description: {
          type: String,
          required: true,
        },
      },
    ],
    location: {
      address: {
        type: String,
        required: true,
      },
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
      hotspot: {
        type: Boolean,
        default: false,
      },
    },
    scheduledDate: {
      type: Date,
      default: Date.now(),
    },
    actualStartDate: {
      type: Date,
      default: null,
    }, // When raid officer starts
    actualEndDate: {
      type: Date,
      default: null,
    }, // When report is submitted
    description: {
      type: String,
      required: true,
    },
    warrant: {
      fileUrl: {
        type: String,
        default: null,
      },
      hash: {
        type: String,
        default: null,
      }, // For integrity verification
      uploadedAt: {
        type: Date,
        default: null,
      },
    },
    isUnplannedRequest: {
      type: Boolean,
      default: false,
    }, // For unplanned raids
    unplannedRequestDetails: {
      approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        default: null,
      }, // Reference to Users
      requestDate: {
        type: Date,
        default: null,
      },
      approvalStatus: {
        type: [String],
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      }, // 'pending', 'approved', 'rejected'
      approvalDate: {
        type: Date,
        default: null,
      },
      rejectionReason: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true }
);

const Raid = mongoose.model("raid", raidSchema);

export default Raid;
