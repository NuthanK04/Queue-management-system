import api from "./api";

export interface Queue {
  id: string;
  name: string;
  description?: string | null;
  managerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Token {
  id: string;
  personName: string;
  position: number;
  status: "WAITING" | "SERVED" | "CANCELLED";
  createdAt: string;
}

interface QueueResponse {
  success: boolean;
  data: Queue[];
}

class QueueService {
  async getQueues(): Promise<Queue[]> {
    const response = await api.get<QueueResponse>("/queues");
    return response.data.data;
  }

  async createQueue(name: string, description?: string): Promise<Queue> {
    const response = await api.post<{ data: Queue }>("/queues", { name, description });
    return response.data.data;
  }

  async getQueue(id: string): Promise<Queue & { tokens: Token[] }> {
    const response = await api.get<{ data: Queue & { tokens: Token[] } }>(`/queues/${id}`);
    return response.data.data;
  }

  async deleteQueue(id: string): Promise<void> {
    await api.delete(`/queues/${id}`);
  }
}

export const queueService = new QueueService();
