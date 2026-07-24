import prisma from "../config/prisma";
import { TokenStatus } from "@prisma/client";

export class DashboardRepository {
  async getDashboardStats(userId: string) {
    const totalQueues = await prisma.queue.count({
      where: {
        managerId: userId,
      },
    });

    const waitingTokens = await prisma.token.count({
      where: {
        queue: {
          managerId: userId,
        },
        status: TokenStatus.WAITING,
      },
    });

    const servedTokens = await prisma.token.count({
      where: {
        queue: {
          managerId: userId,
        },
        status: TokenStatus.SERVED,
      },
    });

    const served = await prisma.token.findMany({
      where: { queue: { managerId: userId }, status: TokenStatus.SERVED, servedAt: { not: null } },
      select: { createdAt: true, servedAt: true },
    });

    const averageWaitMinutes = served.length
      ? Math.round(served.reduce((total, token) => total + (token.servedAt!.getTime() - token.createdAt.getTime()) / 60000, 0) / served.length)
      : 0;

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return date;
    });
    const start = days[0];
    const recentTokens = await prisma.token.findMany({
      where: { queue: { managerId: userId }, createdAt: { gte: start } },
      select: { createdAt: true },
    });
    const queueTrend = days.map((date) => {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        tokensAdded: recentTokens.filter((token) => token.createdAt >= date && token.createdAt < next).length,
      };
    });

    return {
      totalQueues,
      waitingTokens,
      servedTokens,
      averageWaitMinutes,
      queueTrend,
    };
  }
}

export const dashboardRepository = new DashboardRepository();
