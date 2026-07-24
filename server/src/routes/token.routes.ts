import { Router } from "express";
import { tokenController } from "../controllers/token.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Add a person to a queue
router.post("/", authenticate, tokenController.addPerson);

// Get waiting list
router.get("/:queueId", authenticate, tokenController.getWaitingList);

// Mark a token as served
router.patch("/:tokenId/serve", authenticate, tokenController.serveToken);

export default router;