import { Prisma, TokenStatus } from "@prisma/client";
import { tokenRepository } from "../repositories/token.repository";
import { queueRepository } from "../repositories/queue.repository";

class TokenService {
  async addPerson(personName: string, queueId: string, managerId: string) {
    if (!personName?.trim()) throw new Error("Person name is required");
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    const tokenData = {
      personName: personName.trim(),
      queueId,
    };

    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        return await tokenRepository.createWithNextPosition(tokenData);
      } catch (error: unknown) {
        lastError = error;
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }
        throw error;
      }
    }

    throw new Error(
      lastError instanceof Error
        ? lastError.message
        : "Unable to add a person to the queue. Please try again."
    );
  }

  async getWaitingList(queueId: string, managerId: string) {
    const queue = await queueRepository.findById(queueId, managerId);
    if (!queue) throw new Error("Queue not found");
    return tokenRepository.getQueueTokens(queueId);
  }

  async serveToken(tokenId: string, managerId: string) {
    const token = await tokenRepository.findOwnedById(tokenId, managerId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Token already processed");
    }

    return tokenRepository.serveAndReorder(tokenId);
  }

  async cancelToken(tokenId: string, managerId: string) {
    const token = await tokenRepository.findOwnedById(tokenId, managerId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Only waiting tokens can be cancelled");
    }

    return tokenRepository.cancelAndReorder(tokenId);
  }

  async moveTokenUp(tokenId: string, managerId: string) {
    const token = await tokenRepository.findOwnedById(tokenId, managerId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Only waiting tokens can be moved");
    }

    const previousToken = await tokenRepository.findPreviousWaitingToken(
      token.queueId,
      token.position
    );

    if (!previousToken) {
      throw new Error("Token is already at the top");
    }

    await tokenRepository.swapPositions(
      token.id,
      token.position,
      previousToken.id,
      previousToken.position
    );

    return tokenRepository.getQueueTokens(token.queueId);
  }

  async moveTokenDown(tokenId: string, managerId: string) {
    const token = await tokenRepository.findOwnedById(tokenId, managerId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Only waiting tokens can be moved");
    }

    const nextToken = await tokenRepository.findNextWaitingToken(
      token.queueId,
      token.position
    );

    if (!nextToken) {
      throw new Error("Token is already at the bottom");
    }

    await tokenRepository.swapPositions(
      token.id,
      token.position,
      nextToken.id,
      nextToken.position
    );

    return tokenRepository.getQueueTokens(token.queueId);
  }
}

export const tokenService = new TokenService();
