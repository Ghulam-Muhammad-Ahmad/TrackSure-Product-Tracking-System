import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs"; // Added fs module for logging
import dotenv from "dotenv";
dotenv.config();
import "./config/seed.js"; // Added seed.js requirement

//Routes Import
import DashboardRoutes from "./routes/dashboard.routes.js";
import TanentUsersRoutes from "./routes/tanentusers.routes.js";
import authRoutes from "./routes/auth.routes.js";
import CategoriesRoutes from "./routes/categories.routes.js";
import { PrismaClient } from "./src/generated/prisma/index.js";
import ProductsRoutes from "./routes/products.routes.js";
import ProductStatusRoutes from "./routes/product_status.routes.js";
import ActivityLogRoutes from "./routes/activitylog.routes.js"; // Added activitylog.routes.js
import NotificationRoutes from "./routes/notification.routes.js"; // Added activitylog.routes.js
import QrcodesRoutes from "./routes/qrCode.routes.js";
import DocumentCenterRoutes from "./routes/documentCenter.routes.js";
import UploadRoutes from "./routes/upload.routes.js";
import TrackBotRoutes from "./routes/trackbot.routes.js";



const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
import loggingMiddleware from "./middlewares/logging.js";
app.use(loggingMiddleware);

// Route Use
app.use("/dashboard", DashboardRoutes);
app.use("/auth", authRoutes);
app.use("/user", TanentUsersRoutes);
app.use("/categories", CategoriesRoutes);
app.use("/product_status", ProductStatusRoutes);
app.use("/products", ProductsRoutes);
app.use("/activity-logs", ActivityLogRoutes);
app.use("/notifications", NotificationRoutes);
app.use("/qrcode", QrcodesRoutes);
app.use("/docs", DocumentCenterRoutes);
app.use("/upload", UploadRoutes);
app.use("/trackbot", TrackBotRoutes);


// Profile Route
app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// WebSocket integration with JWT authentication
import { initWebSocketAuthenticated } from "./config/websocket.js";
initWebSocketAuthenticated(server);