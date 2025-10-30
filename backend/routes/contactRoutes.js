import express from "express";
import Contact from "../models/Contact.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ----------------------------
// POST new message (public)
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
    res.status(201).json({ message: "Message sent successfully!", data: savedMessage });
  } catch (error) {
    console.error("❌ Error saving contact message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// GET all messages – staff/admin only
router.get("/", requireAuth, requireRole(["staff", "admin"]), async (_req, res) => {
  try {
    const messages = await Contact.find({ deleted: { $ne: true } });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// Mark as read
router.put("/read/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    console.error("❌ Error marking message as read:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// Soft delete
router.put("/soft-delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleted = true;
    await message.save();
    res.json({ message: "Message soft deleted" });
  } catch (error) {
    console.error("❌ Error soft-deleting message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// Restore deleted
router.put("/restore/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.deleted = false;
    await message.save();
    res.json({ message: "Message restored" });
  } catch (error) {
    console.error("❌ Error restoring message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// Permanent delete
router.delete("/delete/:id", requireAuth, requireRole(["staff", "admin"]), async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Message permanently deleted" });
  } catch (error) {
    console.error("❌ Error deleting message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
