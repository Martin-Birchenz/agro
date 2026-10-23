import {
  calculateNutritionalRequirements,
  calculateStockingRate,
  calculatePearsonRation,
  calculateGrazingStrip,
} from "../services/zootechnics.service.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class ZootechnicsController {
  calculateNutrition(req, res, next) {
    try {
      const data = req.body;

      const nutrition = calculateNutritionalRequirements({
        weight: data.weight,
        cmsPercent: data.cmsPercent,
        categoryFactor: data.categoryFactor,
        crudeProteinPercent: data.crudeProteinPercent,
        metabolizableEnergy: data.metabolizableEnergy,
        headCount: data.headCount,
      });

      const stocking = calculateStockingRate({
        headCount: data.headCount,
        evCoefficient: data.evCoefficient,
        surfaceHa: data.surfaceHa,
      });

      return sendSuccess(
        res,
        {
          requerimientoNutricional: nutrition,
          cargaAnimal: stocking,
        },
        "Cálculos zootécnicos procesados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateRation(req, res, next) {
    try {
      const result = calculatePearsonRation(req.body);
      return sendSuccess(
        res,
        result,
        "Ración formulada con éxito mediante Pearson",
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  calculateStrip(req, res, next) {
    try {
      const result = calculateGrazingStrip(req.body);
      return sendSuccess(
        res,
        result,
        "Franja forrajera y asignación calculada con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ZootechnicsController();
