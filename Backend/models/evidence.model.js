import mongoose from "mongoose"

const evidenceSchema = new mongoose.Schema(
  {
    raidId: ObjectId, // Reference to Raids
    exhibitType: String, // 'item', 'document', 'digital'
    category: String,
    description: String,
    quantity: Number,
    seizedBy: ObjectId, // Reference to Users
    seizureDate: Date,
    locationSeized: {
      // GeoJSON
      type: "Point",
      coordinates: [longitude, latitude],
    },
    mediaFiles: [
      {
        fileType: String, // 'image', 'video'
        fileUrl: String,
        originalName: String,
        hash: String,
        metadata: {
          gpsCoordinates: {
            latitude: Number,
            longitude: Number,
          },
          timestamp: Date,
          deviceInfo: String,
        },
        uploadedAt: Date,
      },
    ],
    custodyChain: [
      {
        transferredFrom: ObjectId, // Reference to Users
        transferredTo: ObjectId, // Reference to Users
        transferDate: Date,
        transferPurpose: String,
        digitalSignatures: {
          fromSignature: String,
          toSignature: String,
          signaturesHash: String,
        },
        notes: String,
      },
    ],
    currentHolder: ObjectId, // Reference to Users
    isDisposed: Boolean,
    disposalDetails: {
      method: String,
      disposedBy: ObjectId, // Reference to Users
      disposalDate: Date,
      authorization: String,
    },
  },
  { timestamps: true }
);


const Evidence = moongoose.model("evidence", evidenceSchema);

export default Evidence;