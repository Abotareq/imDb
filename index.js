import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { connectDB, disconnectDB } from "./utils/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Rate limiting (prevent brute force)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

// --- Connect to MongoDB ---
connectDB();

// --- Example Route ---
app.get("/", (req, res) => {
  res.json({ success: true, message: "🎬 IMDb Clone API is running 🚀" });
});

// --- TODO: Add your routes here ---
// app.use("/api/users", userRoutes);
// app.use("/api/entities", entityRoutes);

// --- Error Middleware (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});

// --- Graceful Shutdown ---
process.on("SIGINT", async () => {
  console.log("\n⏳ Shutting down (SIGINT)...");
  await disconnectDB();
  server.close(() => {
    console.log("🛑 Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("\n⏳ Shutting down (SIGTERM)...");
  await disconnectDB();
  server.close(() => {
    console.log("🛑 Server closed");
    process.exit(0);
  });
});
