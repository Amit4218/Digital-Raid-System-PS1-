import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    }, // Reference to Raids
    exhibitType: {
      type: [String],
      enum: ["item", "document", "digital"],
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    seizedBy: {
      type: mongoose.Schema.ObjectId,
      required: true,
    }, // Reference to Users
    seizureDate: {
      type: Date,
      default: Date.now(),
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
          type: String,
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
        default: Date.now(),
      },
    },

    custodyChain: [
      {
        transferredFrom: {
          type: mongoose.Schema.ObjectId,
          default: null,
        },
        transferredTo: {
          type: mongoose.Schema.ObjectId,
          default: null,
        },
        transferDate: {
          type: Date,
          default: null,
        },
        transferPurpose: {
          type: String,
          default: null,
        },
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
        notes: {
          type: String,
          required: true,
        },
      },
    ],
    currentHolder: {
      type: mongoose.Schema.ObjectId,
      required: true,
    }, // Reference to Users
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
      }, // Reference to Users
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
