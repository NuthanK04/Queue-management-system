import prisma from "../config/prisma";
import { TokenStatus, Prisma } from "@prisma/client";

export class TokenRepository {
  async create(data: {
    personName: string;
    position: number;
    queueId: string;
  }) {
    return prisma.token.create({
      data,
    });
  }

  async createWithNextPosition(data: {
    personName: string;
    queueId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const lastToken = await tx.token.findFirst({
        where: {
          queueId: data.queueId,
          status: TokenStatus.WAITING,
        },
        orderBy: {
          position: "desc",
        },
      });

      const position = lastToken ? lastToken.position + 1 : 1;

      return tx.token.create({
        data: {
          personName: data.personName,
          queueId: data.queueId,
          position,
        },
      });
    });
  }

  async getLastToken(queueId: string) {
    return prisma.token.findFirst({
      where: {
        queueId,
        status: TokenStatus.WAITING,
      },
      orderBy: {
        position: "desc",
      },
    });
  }

  async getQueueTokens(queueId: string) {
    return prisma.token.findMany({
      where: {
        queueId,
        status: TokenStatus.WAITING,
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.token.findUnique({
      where: {
        id,
      },
    });
  }

  async findOwnedById(id: string, managerId: string) {
    return prisma.token.findFirst({
      where: { id, queue: { managerId } },
    });
  }

  async update(id: string, data: Prisma.TokenUpdateInput) {
    return prisma.token.update({
      where: {
        id,
      },
      data,
    });
  }

  async cancelToken(id: string) {
    return prisma.token.update({
      where: {
        id,
      },
      data: {
        status: TokenStatus.CANCELLED,
      },
    });
  }

  async serveAndReorder(id: string) {
    return prisma.$transaction(async (tx) => {
      const token = await tx.token.findUnique({
        where: { id },
      });

      if (!token || token.status !== TokenStatus.WAITING) {
        throw new Error("Token not found or already processed");
      }

      const previousToken = await tx.token.findFirst({
        where: {
          queueId: token.queueId,
          status: TokenStatus.WAITING,
          position: {
            lt: token.position,
          },
        },
        orderBy: {
          position: "desc",
        },
      });

      if (previousToken) {
        throw new Error("Only the token at the top of the queue can be served");
      }

      const updated = await tx.token.update({
        where: { id },
        data: {
          status: TokenStatus.SERVED,
          servedAt: new Date(),
        },
      });

      const waitingTokens = await tx.token.findMany({
        where: {
          queueId: token.queueId,
          status: TokenStatus.WAITING,
        },
        orderBy: {
          position: "asc",
        },
      });

      await Promise.all(
        waitingTokens.map((waitingToken, index) =>
          tx.token.update({
            where: { id: waitingToken.id },
            data: { position: index + 1 },
          })
        )
      );

      return updated;
    });
  }

  async cancelAndReorder(id: string) {
    return prisma.$transaction(async (tx) => {
      const token = await tx.token.findUnique({
        where: { id },
      });

      if (!token || token.status !== TokenStatus.WAITING) {
        throw new Error("Token not found or already processed");
      }

      const updated = await tx.token.update({
        where: { id },
        data: {
          status: TokenStatus.CANCELLED,
          cancelledAt: new Date(),
        },
      });

      const waitingTokens = await tx.token.findMany({
        where: {
          queueId: token.queueId,
          status: TokenStatus.WAITING,
        },
        orderBy: {
          position: "asc",
        },
      });

      await Promise.all(
        waitingTokens.map((waitingToken, index) =>
          tx.token.update({
            where: { id: waitingToken.id },
            data: { position: index + 1 },
          })
        )
      );

      return updated;
    });
  }

  async findPreviousWaitingToken(queueId: string, position: number) {
    return prisma.token.findFirst({
      where: {
        queueId,
        status: TokenStatus.WAITING,
        position: {
          lt: position,
        },
      },
      orderBy: {
        position: "desc",
      },
    });
  }

  async findNextWaitingToken(queueId: string, position: number) {
    return prisma.token.findFirst({
      where: {
        queueId,
        status: TokenStatus.WAITING,
        position: {
          gt: position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  async swapPositions(
    firstTokenId: string,
    firstPosition: number,
    secondTokenId: string,
    secondPosition: number
  ) {
    await prisma.$transaction([
      prisma.token.update({
        where: {
          id: firstTokenId,
        },
        data: {
          position: secondPosition,
        },
      }),
      prisma.token.update({
        where: {
          id: secondTokenId,
        },
        data: {
          position: firstPosition,
        },
      }),
    ]);
  }

  async reorderWaitingTokens(queueId: string) {
    const waitingTokens = await prisma.token.findMany({
      where: {
        queueId,
        status: TokenStatus.WAITING,
      },
      orderBy: {
        position: "asc",
      },
    });

    await prisma.$transaction(
      waitingTokens.map((token, index) =>
        prisma.token.update({
          where: {
            id: token.id,
          },
          data: {
            position: index + 1,
          },
        })
      )
    );
  }
}

export const tokenRepository = new TokenRepository();
