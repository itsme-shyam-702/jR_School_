import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/gallery.js";
import admissionRoutes from "./routes/admissions.js";
import contactRoutes from "./routes/contactRoutes.js";

import { requireAuth } from "./middleware/auth.js"; // optional if you use Clerk/JWT

// Load environment variables and connect to DB
dotenv.config();
connectDB();

const app = express();

// ----------------------------
// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------
// Static path for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------------
// API Routes
app.use("/api/admission", admissionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

// ----------------------------
// Frontend Serve (Production only)
if (process.env.NODE_ENV === "production") {
  // 🧠 Vite builds into "dist", not "build"
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // ✅ Catch-all route for client-side routing
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Dev route
  app.get("/", (_req, res) => {
    res.send("Server running in development mode ✅");
  });
}

// ----------------------------
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
