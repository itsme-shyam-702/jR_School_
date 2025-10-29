import express from "express";
import Contact from "../models/Contact.js";
import { requireAuth, requireRole } from "../middleware/auth.js"; // import auth middleware

const router = express.Router();

// ----------------------------
// POST new message – accessible to anyone (visitor can submit)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({
      name,
      email,
      message,
      read: false,
      deleted: false,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// GET all messages – staff & admin only
router.get("/", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const messages = await Contact.find({ deleted: { $ne: true } });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// Mark as read – staff & admin only
router.put("/read/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.read = true;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// Soft delete – staff & admin only
router.put("/soft-delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleted = true;
    await message.save();
    res.json({ message: "Message soft deleted", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// Restore soft deleted message – staff & admin only
router.put("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleted = false;
    await message.save();
    res.json({ message: "Message restored", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------------
// Permanent delete – staff & admin only
router.delete("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Message permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
