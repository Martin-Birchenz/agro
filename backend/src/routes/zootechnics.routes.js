import { Router } from "express";
import zootechnicsController from "../controllers/zootechnics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  nutritionalCalculationSchema,
  pearsonRationSchema,
  grazingStripSchema,
  feedConversionSchema,
  waterBalanceSchema,
  carryingCapacitySchema,
  antiparasiticSchema,
  sanitaryCalendarSchema,
  bodyConditionSchema,
  strategicSupplementationSchema,
  weaningPlanSchema,
  herdStockBalanceSchema,
  directCostsSchema,
  buySellMarginSchema,
} from "../schemas/zootechnics.schema.js";

const router = Router();

// Módulo 01 & 11
router.post(
  "/nutrition-demand",
  validate(nutritionalCalculationSchema),
  (req, res, next) => zootechnicsController.calculateNutrition(req, res, next),
);

// Módulo 02
router.post(
  "/ration-pearson",
  validate(pearsonRationSchema),
  (req, res, next) => zootechnicsController.calculateRation(req, res, next),
);

// Módulo 03
router.post(
  "/carrying-capacity",
  validate(carryingCapacitySchema),
  (req, res, next) =>
    zootechnicsController.calculateCarryingCapacity(req, res, next),
);

// Módulo 04
router.post("/grazing-strip", validate(grazingStripSchema), (req, res, next) =>
  zootechnicsController.calculateStrip(req, res, next),
);

// Módulo 05
router.post(
  "/feed-conversion",
  validate(feedConversionSchema),
  (req, res, next) => zootechnicsController.calculateConversion(req, res, next),
);

// Módulo 07
router.post(
  "/antiparasitic-dosing",
  validate(antiparasiticSchema),
  (req, res, next) =>
    zootechnicsController.calculateAntiparasitic(req, res, next),
);

// Módulo 08
router.post(
  "/sanitary-calendar",
  validate(sanitaryCalendarSchema),
  (req, res, next) => zootechnicsController.calculateCalendar(req, res, next),
);

// Módulo 09
router.post("/water-balance", validate(waterBalanceSchema), (req, res, next) =>
  zootechnicsController.calculateWater(req, res, next),
);

// Módulo 10
router.post(
  "/body-condition",
  validate(bodyConditionSchema),
  (req, res, next) =>
    zootechnicsController.calculateBodyCondition(req, res, next),
);

// Módulo 12
router.post(
  "/strategic-supplementation",
  validate(strategicSupplementationSchema),
  (req, res, next) =>
    zootechnicsController.calculateSupplementation(req, res, next),
);

// Módulo 13
router.post("/weaning-plan", validate(weaningPlanSchema), (req, res, next) =>
  zootechnicsController.calculateWeaning(req, res, next),
);

// Módulo 14
router.post(
  "/herd-stock-balance",
  validate(herdStockBalanceSchema),
  (req, res, next) =>
    zootechnicsController.calculateStockBalance(req, res, next),
);

// Módulo 15
router.post("/direct-costs", validate(directCostsSchema), (req, res, next) =>
  zootechnicsController.calculateDirectCosts(req, res, next),
);

// Módulo 16
router.post(
  "/buy-sell-margin",
  validate(buySellMarginSchema),
  (req, res, next) => zootechnicsController.calculateBuySell(req, res, next),
);

export default router;
