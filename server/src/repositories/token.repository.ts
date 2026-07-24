import prisma from "../config/prisma";
import { TokenStatus } from "@prisma/client";

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

  async update(id: string, data: any) {
    return prisma.token.update({
      where: {
        id,
      },
      data,
    });
  }
}

export const tokenRepository = new TokenRepository();