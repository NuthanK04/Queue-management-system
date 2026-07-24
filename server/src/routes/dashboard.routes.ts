import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Dashboard statistics
router.get("/", authenticate, dashboardController.getDashboard);

export default router;