import { QueueRepository } from "../repositories/queue.repository";

export class QueueService {
  private queueRepository = new QueueRepository();

  async createQueue(data: {
    name: string;
    description?: string;
    managerId: string;
  }) {
    if (!data.name.trim()) {
      throw new Error("Queue name is required");
    }

    return this.queueRepository.create(data);
  }

  async getQueues(managerId: string) {
    return this.queueRepository.findByManager(managerId);
  }

  async getQueue(id: string) {
    const queue = await this.queueRepository.findById(id);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queue;
  }

  async updateQueue(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return this.queueRepository.update(id, data);
  }

  async deleteQueue(id: string) {
    return this.queueRepository.delete(id);
  }
}