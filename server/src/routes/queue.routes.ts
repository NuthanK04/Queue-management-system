import { Router } from "express";
import { queueController } from "../controllers/queue.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Create Queue
router.post("/", authenticate, (req, res) =>
  queueController.createQueue(req, res)
);

// Get All Queues
router.get("/", authenticate, (req, res) =>
  queueController.getQueues(req, res)
);

// Queue Statistics
router.get("/:queueId/stats", authenticate, (req, res) =>
  queueController.getQueueStats(req, res)
);

// Current Serving Token
router.get("/:queueId/current", authenticate, (req, res) =>
  queueController.getCurrentServing(req, res)
);

// Get Queue By ID
router.get("/:queueId", authenticate, (req, res) =>
  queueController.getQueueById(req, res)
);

// Update Queue
router.put("/:queueId", authenticate, (req, res) =>
  queueController.updateQueue(req, res)
);

// Delete Queue
router.delete("/:queueId", authenticate, (req, res) =>
  queueController.deleteQueue(req, res)
);

export default router;