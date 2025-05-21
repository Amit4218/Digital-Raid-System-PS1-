import mongoose from "mongoose";

const handoverRecordSchema = new mongoose.Schema(
  {
    raidId: {
      type: mongoose.Schema.ObjectId,
      ref: "raid",
      required: true,
    },
    exhibitType: {
      type: String,
      ref: "evidence",
      default: "Not Selected",
    },
    exhibitIds: 
      {
        type: String,
        ref: "evidence",
        required: true,
      },
    

    custodyChain: [
      {
        handoverFrom: {
          userId: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            default: null,
          },
          externalDetails: {
            name: { type: String, default: null },
            department: { type: String, default: null },
            designation: { type: String, default: null },
            contact: { type: String, default: null },
            email: { type: String, default: null },
          },
        },
        handoverTo: {
          userId: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            default: null,
          },
          externalDetails: {
            name: { type: String, default: null },
            department: { type: String, default: null },
            designation: { type: String, default: null },
            contact: { type: String, default: null },
            email: { type: String, default: null },
          },
        },
        handoverDate: {
          type: Date,
          default: Date.now,
        },
        purpose: {
          type: String,
          required: true,
        },
        itemDescription: {
          type: String,
          required: true,
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
      },
    ],

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
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

const HandoverRecord = mongoose.model("handoverRecord", handoverRecordSchema);
export default HandoverRecord;

    // verificationCode: String, // For confirmation
    // isReturned: Boolean,
    // returnDetails: {
    //   returnDate: Date,
    //   receivedBy: ObjectId, // Reference to Users
    //   condition: String,
    //   notes: String,
    // },

   