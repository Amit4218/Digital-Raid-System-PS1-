import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: String, // Unique
  password: String, // Hashed
  email: String, // Unique
  role: String, // 'head_official' or 'raid_officer'
  personalDetails: {
    name: String,
    picture: String, // URL or base64
    rank: String,
    department: String,
    contactNumber: String,
    biometricData: String, // Encrypted
    rfidTag: String, // Encrypted
  },
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date,
  permissions: [String], // Specific permissions if needed
  resetToken: String, // For password reset
  resetTokenExpiry: Date,
});

const User = mongoose.model("user", userSchema);

export default User;
