import mongoose from "mongoose";

const { Schema, SchemaTypes } = mongoose;

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["raid_created", "raid_submitted", "raid_approved", "handover_log"],
      required: true,
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
