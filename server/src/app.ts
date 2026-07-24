import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import tokenRoutes from "./routes/token.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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