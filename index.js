import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { connectDB, disconnectDB } from "./utils/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";
import { setupSwagger } from "./docs/swagger.js";
import authRoute from "./auth/auth.route.js";
import userRoute from "./routes/user.route.js";
dotenv.config();

const app = express();
setupSwagger(app);
// --- CORS ---
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
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
// --- Routes ---
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// --- Example Route ---
app.get("/", (req, res) => {
  res.json({ success: true, message: "🎬 IMDb Clone API is running 🚀" });
});

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
