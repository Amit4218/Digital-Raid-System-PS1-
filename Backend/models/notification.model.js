import moongoose from 'mongoose';


const notificationsSent = new moongoose.Schema({
  recipient: ObjectId, // Reference to Users
  title: String,
  message: String,
  relatedEntity: {
    type: String, // 'raid', 'handover', etc.
    id: ObjectId, // Reference to relevant document
  },
  isRead: Boolean,
  createdAt: Date,
  readAt: Date,
  priority: String, // 'high', 'medium', 'low'
},
  { timestamps: true });


const NotificationsSent = moongoose.model('notificationsSent', notificationsSent);
  
export default NotificationsSent;