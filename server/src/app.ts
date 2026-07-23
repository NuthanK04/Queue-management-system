import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Queue Management API",
    status: "Running 🚀",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Queue Management API is running 🚀",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/queues", queueRoutes);

export default app;