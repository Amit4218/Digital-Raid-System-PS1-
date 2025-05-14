import mongoose from "mongoose";

const raidSchema = new mongoose.Schema(
  {
      raidType: String,            // 'planned' or 'unplanned'
  status: String,              // 'pending', 'active', 'completed', 'completed_approved'
  createdBy: ObjectId,         // Reference to Users (head official)
  inCharge: ObjectId,          // Reference to Users (raid officer)
  culprits: [{
    name: String,
    identification: String,    // ID number or other identifier
    description: String
  }],
  location: {
    address: String,
    coordinates: {             // GeoJSON
      type: "Point",
      coordinates: [longitude, latitude]
    },
    hotspot: Boolean
  },
  scheduledDate: Date,
  actualStartDate: Date,       // When raid officer starts
  actualEndDate: Date,         // When report is submitted
  description: String,
  warrant: {
    fileUrl: String,
    hash: String,              // For integrity verification
    uploadedAt: Date
  },
  isUnplannedRequest: Boolean, // For unplanned raids
  unplannedRequestDetails: {
    approvedBy: ObjectId,     // Reference to Users
    requestDate: Date,
    approvalStatus: String,    // 'pending', 'approved', 'rejected'
    approvedBy: ObjectId,      // Reference to Users
    approvalDate: Date,
    rejectionReason: String
    }
  }, { timestamps: true }
);

const Raid = mongoose.model("raid", raidSchema);

export default Raid;
