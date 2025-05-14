import mongoose from "mongoose";

const { Schema, SchemaTypes } = mongoose;

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["raid_created", "report_submitted"],
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: SchemaTypes.ObjectId,
      required: true,
      refPath: "entityType", // optional: resolves to the collection by entityType
    },
    performedBy: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "user", // Assuming a User model exists
    },
    performedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    deviceInfo: {
      type: String,
    },
    changes: [
      {
        field: String,
        oldValue: SchemaTypes.Mixed,
        newValue: SchemaTypes.Mixed,
      },
    ],
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("auditLog", auditLogSchema);
export default AuditLog;
