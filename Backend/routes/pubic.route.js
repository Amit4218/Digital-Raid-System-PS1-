import express from "express";
import Complain from "../models/complain.model.js";
import gemenai from "../utils/gemenai.util.js";
import sendEmail from "../utils/nodemailer.util.js";
import User from "../models/user.model.js";

const router = express.Router();

// otp verification

router.post("/get-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const data = {
      subject: "One-Time-Password Verifycation ",
      text: `Your one time verification code, ${otp},\n Do Not Share, with anyone\n\n EXICSE DEPARTMENT - GOVT OF SIKKIM `,
    };

    await sendEmail(email, data);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// gets the complain && with ai summerization

router.post("/complain", async (req, res) => {
  const { complaintType, transportMode, address, description, images, videos } =
    req.body;

  try {
    // Input validation
    const requiredFields = {
      complaintType,
      transportMode,
      address,
      description,
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    // Create complaint
    const complain = await Complain.create({
      complaintType,
      transportMode,
      address,
      description,
      images: images || [],
      videos: videos || [],
    });

    // Get AI summary
    const ai_summary = await gemenai(complain);
    console.log(ai_summary);

    if (!ai_summary) {
      throw new Error("Failed to generate AI summary");
    }

    // Update complaint with summary
    await Complain.findByIdAndUpdate(complain._id, {
      summary: ai_summary,
    });

    // Handle drug-related complaints
    if (complaintType.toLowerCase() === "drug") {
      const users = await User.find({}, "email");

      const emailData = {
        subject: "Alert: Drug-related Complaint Received",
        text: `
          Important information regarding illegal activity:
          
          Location: ${address}
          Description: ${description}
          Summary: ${ai_summary}
          
          This is an automated alert. Please take appropriate action.
        `,
      };

      // Send emails in parallel
      await Promise.all(users.map((user) => sendEmail(user.email, emailData)));
    }

    res.status(201).json({
      message: "Complaint registered successfully",
      complaintId: complain._id,
    });
  } catch (error) {
    console.error("Complaint registration error:", error);
    res.status(500).json({
      message: "Failed to process complaint",
      error: error.message,
    });
  }
});

router.get("/get-all-complains", async (req, res) => {});

export default router;
