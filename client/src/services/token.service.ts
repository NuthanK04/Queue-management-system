import api from "./api";
import type { Token } from "./queue.service";

class TokenService {
  async addPerson(queueId: string, personName: string): Promise<Token> {
    const response = await api.post<{ data: Token }>("/tokens", { queueId, personName });
    return response.data.data;
  }

  async serve(id: string): Promise<void> { await api.patch(`/tokens/${id}/serve`); }
  async cancel(id: string): Promise<void> { await api.patch(`/tokens/${id}/cancel`); }
  async moveUp(id: string): Promise<void> { await api.patch(`/tokens/${id}/move-up`); }
  async moveDown(id: string): Promise<void> { await api.patch(`/tokens/${id}/move-down`); }
}

export const tokenService = new TokenService();
