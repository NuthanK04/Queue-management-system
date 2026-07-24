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

  async getLastToken(queueId: string) {
    return prisma.token.findFirst({
      where: {
        queueId,
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
}

export const tokenRepository = new TokenRepository();