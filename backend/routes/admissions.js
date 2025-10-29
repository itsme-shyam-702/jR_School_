import express from "express";
import Admission from "../models/Admission.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ✅ Validation helper
const validateFields = (fields) => {
  return Object.values(fields).every((value) => value && value.trim() !== "");
};

// 📩 Submit a new admission
router.post(
  "/",
  requireAuth,
  requireRole(["visitor", "staff", "admin"]),
  async (req, res) => {
    try {
      const { name, selectedClass, dob, parentName, contact, address } = req.body;

      // ✅ Validate fields
      if (
        !validateFields({
          name,
          selectedClass,
          dob,
          parentName,
          contact,
          address,
        })
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // ✅ Create new admission
      const newAdmission = new Admission({
        name,
        selectedClass,
        dob,
        parentName,
        contact,
        address,
      });

      await newAdmission.save();

      res.status(201).json({ message: "Admission submitted successfully!" });
    } catch (err) {
      console.error("❌ Error submitting admission:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 📜 Get all admissions
router.get(
  "/",
  requireAuth,
  requireRole(["staff", "admin"]),
  async (req, res) => {
    try {
      const admissions = await Admission.find().sort({ createdAt: -1 });
      res.status(200).json(admissions);
    } catch (err) {
      console.error("❌ Error fetching admissions:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🗑️ Delete admission
router.delete(
  "/:id",
  requireAuth,
  requireRole(["staff", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const deletedAdmission = await Admission.findByIdAndDelete(id);

      if (!deletedAdmission) {
        return res.status(404).json({ message: "Admission not found" });
      }

      res.status(200).json({ message: "Admission deleted successfully!" });
    } catch (err) {
      console.error("❌ Error deleting admission:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
