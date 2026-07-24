import { TokenStatus } from "@prisma/client";
import { tokenRepository } from "../repositories/token.repository";
import { queueRepository } from "../repositories/queue.repository";

class TokenService {
  async addPerson(personName: string, queueId: string, managerId: string) {
    if (!personName?.trim()) throw new Error("Person name is required");
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    const lastToken = await tokenRepository.getLastToken(queueId);

    const position = lastToken ? lastToken.position + 1 : 1;

    return tokenRepository.create({
      personName: personName.trim(),
      position,
      queueId,
    });
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

    const tokenAhead = await tokenRepository.findPreviousWaitingToken(
      token.queueId,
      token.position
    );
    if (tokenAhead) {
      throw new Error("Only the token at the top of the queue can be served");
    }

    const updatedToken = await tokenRepository.update(tokenId, {
      status: TokenStatus.SERVED,
      servedAt: new Date(),
    });

    await tokenRepository.reorderWaitingTokens(token.queueId);

    return updatedToken;
  }

  async cancelToken(tokenId: string, managerId: string) {
    const token = await tokenRepository.findOwnedById(tokenId, managerId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Only waiting tokens can be cancelled");
    }

    const updatedToken = await tokenRepository.update(tokenId, {
      status: TokenStatus.CANCELLED,
      cancelledAt: new Date(),
    });

    await tokenRepository.reorderWaitingTokens(token.queueId);

    return updatedToken;
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
