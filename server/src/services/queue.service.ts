import { queueRepository } from "../repositories/queue.repository";

class QueueService {
  async createQueue(
    name: string,
    description: string | undefined,
    managerId: string
  ) {
    if (!name?.trim()) throw new Error("Queue name is required");
    return queueRepository.create({
      name: name.trim(),
      description,
      managerId,
    });
  }

  async getQueues(managerId: string) {
    return queueRepository.findByManager(managerId);
  }

  async getQueueById(queueId: string, managerId: string) {
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queue;
  }

  async updateQueue(
    queueId: string, managerId: string,
    name?: string,
    description?: string
  ) {
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.update(queueId, {
      name,
      description,
    });
  }

  async deleteQueue(queueId: string, managerId: string) {
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.delete(queueId);
  }

  async getQueueStats(queueId: string, managerId: string) {
    await this.getQueueById(queueId, managerId);
    const stats = await queueRepository.getQueueStats(queueId);

    if (!stats) {
      throw new Error("Queue not found");
    }

    return stats;
  }

  async getCurrentServing(queueId: string, managerId: string) {
    const queue = await queueRepository.findById(queueId, managerId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.getCurrentServing(queueId);
  }
}

export const queueService = new QueueService();
