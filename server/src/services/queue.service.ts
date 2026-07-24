import { queueRepository } from "../repositories/queue.repository";

class QueueService {
  async createQueue(
    name: string,
    description: string | undefined,
    managerId: string
  ) {
    return queueRepository.create({
      name,
      description,
      managerId,
    });
  }

  async getQueues(managerId: string) {
    return queueRepository.findByManager(managerId);
  }

  async getQueueById(queueId: string) {
    const queue = await queueRepository.findById(queueId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queue;
  }

  async updateQueue(
    queueId: string,
    name?: string,
    description?: string
  ) {
    const queue = await queueRepository.findById(queueId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.update(queueId, {
      name,
      description,
    });
  }

  async deleteQueue(queueId: string) {
    const queue = await queueRepository.findById(queueId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.delete(queueId);
  }

  async getQueueStats(queueId: string) {
    const stats = await queueRepository.getQueueStats(queueId);

    if (!stats) {
      throw new Error("Queue not found");
    }

    return stats;
  }

  async getCurrentServing(queueId: string) {
    const queue = await queueRepository.findById(queueId);

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queueRepository.getCurrentServing(queueId);
  }
}

export const queueService = new QueueService();