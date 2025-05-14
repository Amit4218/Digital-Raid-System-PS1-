import moongoose from 'mongoose'

const auditLogSchema = new moongoose.Schema({
  action: String, // E.g., 'raid_created', 'report_submitted'
  entityType: String, // E.g., 'raid', 'evidence'
  entityId: ObjectId, // Reference to relevant document
  performedBy: ObjectId, // Reference to Users
  performedAt: Date,
  ipAddress: String,
  deviceInfo: String,
  changes: [
    {
      field: String,
      oldValue: Mixed,
      newValue: Mixed,
    },
  ],
  metadata: Object, // Additional context if needed
}, { timestamps: true });



const AuditLog = moongoose.model('auditLog', auditLogSchema);
export default AuditLog;