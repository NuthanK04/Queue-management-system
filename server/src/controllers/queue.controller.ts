import { Request, Response } from "express";
import { queueService } from "../services/queue.service";

class QueueController {
  async createQueue(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const managerId = req.userId!;

      const queue = await queueService.createQueue(
        name,
        description,
        managerId
      );

      return res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: queue,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create queue",
      });
    }
  }

  async getQueues(req: Request, res: Response) {
    try {
      const managerId = req.userId!;

      const queues = await queueService.getQueues(managerId);

      return res.status(200).json({
        success: true,
        data: queues,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch queues",
      });
    }
  }

  async getQueueById(req: Request, res: Response) {
    try {
      const { queueId } = req.params;

      const queue = await queueService.getQueueById(queueId);

      return res.status(200).json({
        success: true,
        data: queue,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Queue not found",
      });
    }
  }

  async updateQueue(req: Request, res: Response) {
    try {
      const { queueId } = req.params;
      const { name, description } = req.body;

      const queue = await queueService.updateQueue(
        queueId,
        name,
        description
      );

      return res.status(200).json({
        success: true,
        message: "Queue updated successfully",
        data: queue,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update queue",
      });
    }
  }

  async deleteQueue(req: Request, res: Response) {
    try {
      const { queueId } = req.params;

      await queueService.deleteQueue(queueId);

      return res.status(200).json({
        success: true,
        message: "Queue deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete queue",
      });
    }
  }

  async getQueueStats(req: Request, res: Response) {
    try {
      const { queueId } = req.params;

      const stats = await queueService.getQueueStats(queueId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch queue statistics",
      });
    }
  }

  async getCurrentServing(req: Request, res: Response) {
    try {
      const { queueId } = req.params;

      const current = await queueService.getCurrentServing(queueId);

      return res.status(200).json({
        success: true,
        data: current,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch current serving token",
      });
    }
  }
}

export const queueController = new QueueController();