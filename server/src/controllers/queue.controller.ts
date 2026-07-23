import { Request, Response } from "express";
import { QueueService } from "../services/queue.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const queueService = new QueueService();

export class QueueController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description } = req.body;

      const queue = await queueService.createQueue({
        name,
        description,
        managerId: req.userId!,
      });

      return res.status(201).json({
        success: true,
        message: "Queue created successfully",
        data: queue,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const queues = await queueService.getQueues(req.userId!);

      return res.json({
        success: true,
        data: queues,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const queue = await queueService.getQueue(req.params.id);

      return res.json({
        success: true,
        data: queue,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const queue = await queueService.updateQueue(req.params.id, req.body);

      return res.json({
        success: true,
        message: "Queue updated successfully",
        data: queue,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await queueService.deleteQueue(req.params.id);

      return res.json({
        success: true,
        message: "Queue deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export const queueController = new QueueController();