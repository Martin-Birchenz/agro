import { Router } from "express";
import zootechnicsController from "../controllers/zootechnics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  nutritionalCalculationSchema,
  pearsonRationSchema,
  grazingStripSchema,
  feedConversionSchema,
  waterBalanceSchema,
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

router.post(
  "/feed-conversion",
  validate(feedConversionSchema),
  zootechnicsController.calculateConversion,
);

router.post(
  "/water-balance",
  validate(waterBalanceSchema),
  zootechnicsController.calculateWater,
);

export default router;
