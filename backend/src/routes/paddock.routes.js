import { Router } from "express";
import paddockController from "../controllers/paddock.controller.js";

const router = Router();

router.get("/:paddockId/metrics", (req, res, next) =>
  paddockController.getMetrics(req, res, next),
);

export default router;
