import express from "express";
import Department from "../models/department.model.js";
import bcrypt from "bcrypt";
import Complain from "../models/complain.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { departmentId, password } = req.body;

  try {
    const department = await Department.findOne({ departmentId });

    if (!department) {
      return res.status(400).json({ message: "Department not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, department.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: department._id, departmentId: department.departmentId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      department,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

router.post("/get-all-complain", async (req, res) => {
  try {
    const complains = await Complain.find({ complaintType: "drug" });
    res.status(200).json({ complains });
  } catch (error) {
    console.error("Error fetching drug complaints:", error);
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

export default router;
