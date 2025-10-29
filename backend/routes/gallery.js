import express from "express";
import multer from "multer";
import path from "path";
import Gallery from "../models/Gallery.js";
import { requireAuth, requireRole } from "../middleware/auth.js"; // import auth middleware

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Get all gallery images (active) – all authenticated users
router.get("/", requireAuth, requireRole(["visitor", "staff", "admin"]), async (req, res) => {
  try {
    const images = await Gallery.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get deleted images – staff & admin only
router.get("/deleted", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const deletedImages = await Gallery.find({ deleted: true }).sort({ createdAt: -1 });
    res.json(deletedImages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload new image – staff & admin only
router.post("/", requireAuth, requireRole(["staff", "admin"]), upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    let filePath = "";
    let fileType = "";

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype.split("/")[0];
    }

    const newImage = await Gallery.create({
      title,
      description,
      filePath,
      fileType,
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Soft delete – staff & admin only
router.patch("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Image moved to deleted" });
});

// ✅ Restore image – staff & admin only
router.patch("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Image restored" });
});

// ✅ Permanently delete – staff & admin only
router.delete("/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ message: "Image permanently deleted" });
});

export default router;
