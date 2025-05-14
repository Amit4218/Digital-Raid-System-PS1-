import mongoose from 'mongoose';

const handoverRecordSchema = new mongoose.Schema({
  raidId: ObjectId, // Reference to Raids
  exhibitIds: [ObjectId], // Reference to Evidence
  handoverFrom: ObjectId, // Reference to Users (raid officer)
  handoverTo: {
    userId: ObjectId, // Reference to Users (if system user)
    externalDetails: {
      // If not a system user
      name: String,
      department: String,
      designation: String,
      contact: String,
      email: String,
    },
  },
  handoverDate: Date,
  purpose: String,
  quantity: Number, // Total items handed over
  digitalSignatures: {
    fromSignature: String,
    toSignature: String,
    signaturesHash: String,
  },
  verificationCode: String, // For confirmation
  isReturned: Boolean,
  returnDetails: {
    returnDate: Date,
    receivedBy: ObjectId, // Reference to Users
    condition: String,
    notes: String,
  },
  notificationsSent: {
    toHead: Boolean,
    toInCharge: Boolean,
    toReceiver: Boolean,
    sentAt: Date,
  },
}, { timestamps: true });


const handoverRecord = mongoose.model('handoverRecord', handoverRecordSchema);
export default handoverRecord;