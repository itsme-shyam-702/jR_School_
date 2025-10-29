import express from "express";
import multer from "multer";
import path from "path";
import Event from "../models/Event.js";
import { requireAuth, requireRole } from "../middleware/auth.js"; // import auth middleware

const router = express.Router();

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ GET active events (any authenticated user)
router.get("/", requireAuth, requireRole(["visitor", "staff", "admin"]), async (req, res) => {
  const events = await Event.find({ deleted: false }).sort({ date: -1 });
  res.json(events);
});

// ✅ GET deleted events (staff & admin only)
router.get("/deleted", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  const events = await Event.find({ deleted: true }).sort({ date: -1 });
  res.json(events);
});

// ✅ POST add new event (staff & admin only)
router.post("/", requireAuth, requireRole(["staff", "admin"]), upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    let filePath = "";
    let fileType = "";

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype.split("/")[0];
    }

    const event = await Event.create({
      title,
      description,
      date,
      filePath,
      fileType,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PATCH soft delete (staff & admin only)
router.patch("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: true });
  res.json({ message: "Event moved to deleted" });
});

// ✅ PATCH restore event (staff & admin only)
router.patch("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { deleted: false });
  res.json({ message: "Event restored" });
});

// ✅ DELETE permanent delete (staff & admin only)
router.delete("/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event permanently deleted" });
});

export default router;
