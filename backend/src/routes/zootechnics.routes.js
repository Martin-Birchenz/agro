import { Router } from "express";
import zootechnicsController from "../controllers/zootechnics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  nutritionalCalculationSchema,
  pearsonRationSchema,
  grazingStripSchema,
} from "../schemas/zootechnics.schema.js";

const router = Router();

router.post(
  "/nutrition-demand",
  validate(nutritionalCalculationSchema),
  zootechnicsController.calculateNutrition,
);

router.post(
  "/ration-pearson",
  validate(pearsonRationSchema),
  zootechnicsController.calculateRation,
);

router.post(
  "/grazing-strip",
  validate(grazingStripSchema),
  zootechnicsController.calculateStrip,
);

export default router;
