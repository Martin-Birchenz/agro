import { Router } from "express";
import zootechnicsController from "../controllers/zootechnics.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { nutritionalCalculationSchema } from "../schemas/zootechnics.schema.js";

const router = Router();

router.post(
  "/nutrition-demand",
  validate(nutritionalCalculationSchema),
  zootechnicsController.calculateNutrition,
);

export default router;
