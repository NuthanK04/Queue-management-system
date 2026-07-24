import { Router } from "express";
import { tokenController } from "../controllers/token.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Add a person to a queue
router.post("/", authenticate, tokenController.addPerson);

// Get waiting list for a queue
router.get("/:queueId", authenticate, tokenController.getWaitingList);

// Serve a token
router.patch("/:tokenId/serve", authenticate, tokenController.serveToken);

// Cancel a token
router.patch("/:tokenId/cancel", authenticate, tokenController.cancelToken);

// Move token up
router.patch("/:tokenId/move-up", authenticate, tokenController.moveTokenUp);

// Move token down
router.patch("/:tokenId/move-down", authenticate, tokenController.moveTokenDown);

export default router;