import express from "express";
import cors from "cors";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import tokenRoutes from "./routes/token.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { env } from "./config/env";

const app = express();

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:80"];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const clientStaticPath = path.resolve(__dirname, "../public");
if (fs.existsSync(clientStaticPath)) {
  app.use(express.static(clientStaticPath));

  app.get(/^\/(?!api|health).*/, (_req, res) => {
    res.sendFile(path.join(clientStaticPath, "index.html"));
  });
}

// Root Route
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Queue Management API",
    status: "Running 🚀",
  });
});

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Queue Management API is running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;