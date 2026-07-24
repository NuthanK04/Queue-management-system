import { dashboardRepository } from "../repositories/dashboard.repository";

class DashboardService {
  async getDashboardStats(userId: string) {
    return dashboardRepository.getDashboardStats(userId);
  }
}

export const dashboardService = new DashboardService();