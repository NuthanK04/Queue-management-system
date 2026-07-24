import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      const stats = await dashboardService.getDashboardStats(userId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard statistics",
      });
    }
  }
}

export const dashboardController = new DashboardController();