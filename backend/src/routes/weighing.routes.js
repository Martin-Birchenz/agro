import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { batchWeighingSchema } from "../schemas/weighing.schema.js";
import weighingController from "../controllers/weighing.controller.js";

const router = Router();

router.post(
  "/batch-sync",
  validate(batchWeighingSchema),
  weighingController.syncBatch,
);

router.get("/animal/:rfidTag", weighingController.getByRfid);

router.post("/batch-sync", (req, res, next) =>
  weighingController.syncBatch(req, res, next),
);
router.get("/fiche/:rfidTag", (req, res, next) =>
  weighingController.getByRfid(req, res, next),
);
router.post("/manual", (req, res, next) =>
  weighingController.createManual(req, res, next),
);

export default router;
