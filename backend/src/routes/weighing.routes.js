import { Router } from "express";
import weighingController from "../controllers/weighing.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { batchWeighingSchema } from "../schemas/weighing.schema.js";

const router = Router();

router.post(
  "/batch-sync",
  validate(batchWeighingSchema),
  weighingController.syncBatch,
);

router.get("/animal/:rfidTag", weighingController.getByRfid);

export default router;
