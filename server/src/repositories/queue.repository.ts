import prisma from "../config/prisma";
import { TokenStatus } from "@prisma/client";

export class QueueRepository {
  async create(data: {
    name: string;
    description?: string;
    managerId: string;
  }) {
    return prisma.queue.create({
      data,
    });
  }

  async findByManager(managerId: string) {
    return prisma.queue.findMany({
      where: {
        managerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.queue.findUnique({
      where: {
        id,
      },
      include: {
        tokens: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.queue.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.queue.delete({
      where: {
        id,
      },
    });
  }

  async getQueueStats(queueId: string) {
    const queue = await prisma.queue.findUnique({
      where: {
        id: queueId,
      },
      include: {
        _count: {
          select: {
            tokens: true,
          },
        },
      },
    });

    if (!queue) {
      return null;
    }

    const waiting = await prisma.token.count({
      where: {
        queueId,
        status: TokenStatus.WAITING,
      },
    });

    const served = await prisma.token.count({
      where: {
        queueId,
        status: TokenStatus.SERVED,
      },
    });

    const cancelled = await prisma.token.count({
      where: {
        queueId,
        status: TokenStatus.CANCELLED,
      },
    });

    return {
      queueName: queue.name,
      totalTokens: queue._count.tokens,
      waiting,
      served,
      cancelled,
    };
  }

  async getCurrentServing(queueId: string) {
    return prisma.token.findFirst({
      where: {
        queueId,
        status: TokenStatus.SERVED,
      },
      orderBy: {
        servedAt: "desc",
      },
      select: {
        id: true,
        personName: true,
        position: true,
        servedAt: true,
      },
    });
  }
}

export const queueRepository = new QueueRepository();