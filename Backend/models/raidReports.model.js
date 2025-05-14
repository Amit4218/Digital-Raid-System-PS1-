import mongoose from "mongoose";

const raidReportSchema = new mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      ref: "raid",
      required: true,
    }, // Reference to Raids
    submittedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users (inCharge)
    submissionDate: {
      type: Date,
      default: Date.now(),
    },
    startCoordinates: {
      longitude: {
        type: String,
        required: true,
      },
      latitude: {
        type: String,
        required: true,
      },
    },
    endCoordinates: {
      // GeoJSON
      longitude: {
        type: String,
        default: null,
      },
      latitude: {
        type: String,
        default: null,
      },
    },
    writtenReport: {
      type: String,
      required: true,
    },
    licenseChecks: [
      {
        licenseNumber: {
          type: Number,
          default: null,
        },
        isValid: {
          type: Boolean,
          required: true,
        },
        violations: {
          type: [String],
          required: true,
        },
        criminalRecords: {
          type: [String],
          default: null,
        },
      },
    ],
    digitalSignature: {
      officerSignature: {
        type: String,
        required: true,
      },
      signatureDate: {
        type: Date,
        default: Date.now(),
      },
      signatureHash: {
        type: String,
        required: true,
      },
    },
    headReview: {
      reviewedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        default: null,
      }, // Reference to Users
      reviewDate: {
        type: Date,
        default: null,
      },
      approvalStatus: {
        type: [String],
        enum: ["approved", "rejected"],
        default: null,
      }, // 'approved', 'rejected'
      headSignature: {
        type: String,
        default: null,
      },
      signatureHash: {
        type: String,
        default: null,
      },
      comments: {
        type: String,
        default: null,
      },
    },
    isFinal: {
      type: Boolean,
      default: false,
    }, // If approved by head
  },
  { timestamps: true }
);

const RaidReport = mongoose.model("raidReport", raidReportSchema);

export default RaidReport;
