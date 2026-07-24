import { TokenStatus } from "@prisma/client";
import { tokenRepository } from "../repositories/token.repository";
import { queueRepository } from "../repositories/queue.repository";

class TokenService {
  async addPerson(personName: string, queueId: string) {
    const queue = await queueRepository.findById(queueId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    const lastToken = await tokenRepository.getLastToken(queueId);

    const position = lastToken ? lastToken.position + 1 : 1;

    return tokenRepository.create({
      personName,
      position,
      queueId,
    });
  }

  async getWaitingList(queueId: string) {
    return tokenRepository.getQueueTokens(queueId);
  }

  async serveToken(tokenId: string) {
    const token = await tokenRepository.findById(tokenId);

    if (!token) {
      throw new Error("Token not found");
    }

    if (token.status !== TokenStatus.WAITING) {
      throw new Error("Token already processed");
    }

    return tokenRepository.update(tokenId, {
      status: TokenStatus.SERVED,
      servedAt: new Date(),
    });
  }
}

export const tokenService = new TokenService();