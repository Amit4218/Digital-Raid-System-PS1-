import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["raid_officer", "head_official"],
      default: "raid_officer",
    },
    personalDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      picture: {
        type: String,
        trim: true,
        default:
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
      }, // URL or base64
      rank: {
        type: String,
        trim: true,
        default: "3_tara_kanchi",
      },
      department: {
        type: String,
        trim: true,
        required: true,
      },
      contactNumber: {
        type: Number,
        required: true,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // biometricData: String, // Encrypted
    // rfidTag: String, // Encrypted
    // permissions: [String], // Specific permissions if needed
    // resetToken: String, // For password reset
    // resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
