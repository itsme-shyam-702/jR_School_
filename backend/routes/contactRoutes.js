import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ----------------------------
// POST new message (PUBLIC)
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, message, read: false, deleted: false });
    const savedMessage = await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!", data: savedMessage });
  } catch (error) {
    console.error("❌ Error saving contact message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------
// GET and admin routes (optional)
router.get("/", async (_req, res) => {
  try {
    const messages = await Contact.find({ deleted: { $ne: true } });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
