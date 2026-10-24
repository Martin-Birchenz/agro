import { Router } from "express";
import paddockController from "../controllers/paddock.controller.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import { createPaddockSchema } from "../schemas/paddock.schema.js";

const router = Router();

router.get("/:paddockId/metrics", (req, res, next) =>
  paddockController.getMetrics(req, res, next),
);

router.put("/animals/:animalId/move", (req, res, next) =>
  paddockController.moveAnimal(req, res, next),
);

router.get("/", (req, res, next) => paddockController.getAll(req, res, next));

router.post("/", validateBody(createPaddockSchema), (req, res, next) =>
  paddockController.create(req, res, next),
);

export default router;
