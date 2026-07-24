import api from "./api";

export interface DashboardStats {
  totalQueues: number;
  waitingTokens: number;
  servedTokens: number;
  averageWaitMinutes: number;
  queueTrend: { label: string; tokensAdded: number }[];
}

interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardResponse>("/dashboard");
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
