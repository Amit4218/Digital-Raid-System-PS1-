import mongoose from "mongoose";

const handoverRecordSchema = new mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      ref: "raid",
      required: true,
    }, // Reference to Raids
    exhibitIds: {
      type: mongoose.Schema.ObjectId,
      ref: "evidence",
      required: true,
    }, // Reference to Evidence
    handoverFrom: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to Users (raid officer)
    handoverTo: {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      }, // Reference to Users (if system user)
      externalDetails: {
        // If not a system user
        name: {
          type: String,
          default: null,
        },
        department: {
          type: String,
          default: null,
        },
        designation: {
          type: String,
          default: null,
        },
        contact: {
          type: String,
          default: null,
        },
        email: {
          type: String,
          default: null,
        },
      },
    },
    handoverDate: {
      type: Date,
      default: Date.now(),
    },
    purpose: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }, // Total items handed over
    digitalSignatures: {
      fromSignature: {
        type: String,
        required: true,
      },
      toSignature: {
        type: String,
        required: true,
      },
      signaturesHash: {
        type: String,
        required: true,
      },
    },
    // verificationCode: String, // For confirmation
    // isReturned: Boolean,
    // returnDetails: {
    //   returnDate: Date,
    //   receivedBy: ObjectId, // Reference to Users
    //   condition: String,
    //   notes: String,
    // },

    notificationsSent: {
      toHead: {
        type: Boolean,
        default: true,
      },
      toInCharge: {
        type: Boolean,
        default: true,
      },
      toReceiver: {
        type: Boolean,
        default: true,
      },
      sentAt: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

const handoverRecord = mongoose.model("handoverRecord", handoverRecordSchema);
export default handoverRecord;
