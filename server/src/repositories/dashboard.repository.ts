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

    return {
      totalQueues,
      waitingTokens,
      servedTokens,
    };
  }
}

export const dashboardRepository = new DashboardRepository();