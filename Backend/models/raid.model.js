import mongoose from "mongoose";

const raidSchema = new mongoose.Schema(
  {
    raidType: {
      type: String,
      enum: ["planned", "unplanned"],
      default: "unplanned",
    }, // 'planned' or 'unplanned'
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    }, // 'pending', 'active', 'completed', 'completed_approved'
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users (head official)
    inCharge: {
      type: String,
      required: true,
    },
    inchargeId: {
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
          default: null,
        }, // ID number or other identifier
        description: {
          type: String,
          default: null,
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
          default: null,
        },
        latitude: {
          type: String,
          default: null,
        },
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
      default: true,
    }, // For unplanned raids
    unplannedRequestDetails: {
      approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        default: null,
      }, // Reference to Users
      requestDate: {
        type: Date,
        default: Date.now(),
      },
      approvalStatus: {
        type: String,
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
