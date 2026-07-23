import { Router } from "express";
import { queueController } from "../controllers/queue.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticate, (req, res) =>
  queueController.create(req, res)
);

router.get("/", authenticate, (req, res) =>
  queueController.getAll(req, res)
);

router.get("/:id", authenticate, (req, res) =>
  queueController.getById(req, res)
);

router.put("/:id", authenticate, (req, res) =>
  queueController.update(req, res)
);

router.delete("/:id", authenticate, (req, res) =>
  queueController.delete(req, res)
);

export default router;