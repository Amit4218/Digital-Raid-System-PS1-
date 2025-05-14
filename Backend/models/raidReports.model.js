import mongoose from "mongoose"

const raidReportSchema = new mongoose.Schema({
  raidId: ObjectId, // Reference to Raids
  submittedBy: ObjectId, // Reference to Users (inCharge)
  submissionDate: Date,
  startCoordinates: {
    // GeoJSON
    type: "Point",
    coordinates: [longitude, latitude],
  },
  endCoordinates: {
    // GeoJSON
    type: "Point",
    coordinates: [longitude, latitude],
  },
  writtenReport: String,
  licenseChecks: [
    {
      licenseNumber: String,
      isValid: Boolean,
      violations: [String],
      criminalRecords: [String],
    },
  ],
  digitalSignature: {
    officerSignature: String,
    signatureDate: Date,
    signatureHash: String,
  },
  headReview: {
    reviewedBy: ObjectId, // Reference to Users
    reviewDate: Date,
    approvalStatus: String, // 'approved', 'rejected'
    headSignature: String,
    signatureHash: String,
    comments: String,
  },
  isFinal: Boolean, // If approved by head
}, { timestamps: true })
  
  
  
const RaidReport = mongoose.model("raidReport", raidReportSchema)

export default RaidReport