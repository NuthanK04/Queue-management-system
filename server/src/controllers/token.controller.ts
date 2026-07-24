import { Request, Response } from "express";
import { tokenService } from "../services/token.service";

class TokenController {
  async addPerson(req: Request, res: Response) {
    try {
      const { personName, queueId } = req.body;

      const token = await tokenService.addPerson(personName, queueId);

      return res.status(201).json({
        success: true,
        message: "Person added to queue successfully",
        data: token,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to add person",
      });
    }
  }

  async getWaitingList(req: Request, res: Response) {
    try {
      const { queueId } = req.params;

      const tokens = await tokenService.getWaitingList(queueId);

      return res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch waiting list",
      });
    }
  }

  async serveToken(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;

      const token = await tokenService.serveToken(tokenId);

      return res.status(200).json({
        success: true,
        message: "Token served successfully",
        data: token,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to serve token",
      });
    }
  }

  async cancelToken(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;

      const token = await tokenService.cancelToken(tokenId);

      return res.status(200).json({
        success: true,
        message: "Token cancelled successfully",
        data: token,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to cancel token",
      });
    }
  }

  async moveTokenUp(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;

      const tokens = await tokenService.moveTokenUp(tokenId);

      return res.status(200).json({
        success: true,
        message: "Token moved up successfully",
        data: tokens,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to move token up",
      });
    }
  }

  async moveTokenDown(req: Request, res: Response) {
    try {
      const { tokenId } = req.params;

      const tokens = await tokenService.moveTokenDown(tokenId);

      return res.status(200).json({
        success: true,
        message: "Token moved down successfully",
        data: tokens,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to move token down",
      });
    }
  }
}

export const tokenController = new TokenController();