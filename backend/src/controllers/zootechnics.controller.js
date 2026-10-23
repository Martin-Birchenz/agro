import {
  calculateNutritionalRequirements,
  calculateStockingRate,
  calculatePearsonRation,
  calculateGrazingStrip,
  calculateFeedConversion,
  calculateWaterBalance,
  calculateStockingAndCarryingCapacity,
  calculateAntiparasiticDosing,
  calculateSanitaryCalendar,
  calculateBodyConditionAndPregnancy,
  calculateStrategicSupplementation,
  calculateWeaningAndRearingPlan,
  calculateHerdStockBalance,
  calculateDirectCostsAndBreakEven,
  calculateBuySellMargin,
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
  calculateConversion(req, res, next) {
    try {
      const result = calculateFeedConversion(req.body);
      return sendSuccess(
        res,
        result,
        "Conversión alimenticia calculada con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateWater(req, res, next) {
    try {
      const result = calculateWaterBalance(req.body);
      return sendSuccess(
        res,
        result,
        "Balance hídrico y autonomía calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateCarryingCapacity(req, res, next) {
    try {
      const result = calculateStockingAndCarryingCapacity(req.body);
      return sendSuccess(
        res,
        result,
        "Receptividad forrajera y balance EV calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateAntiparasitic(req, res, next) {
    try {
      const result = calculateAntiparasiticDosing(req.body);
      return sendSuccess(
        res,
        result,
        "Dosificación y carencia calculadas con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateCalendar(req, res, next) {
    try {
      const result = calculateSanitaryCalendar(req.body);
      return sendSuccess(
        res,
        result,
        "Calendario sanitario anual procesado con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateBodyCondition(req, res, next) {
    try {
      const result = calculateBodyConditionAndPregnancy(req.body);
      return sendSuccess(
        res,
        result,
        "Condición corporal y preñez estimada calculadas con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateSupplementation(req, res, next) {
    try {
      const result = calculateStrategicSupplementation(req.body);
      return sendSuccess(
        res,
        result,
        "Suplementación y forraje ahorrado calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateWeaning(req, res, next) {
    try {
      const result = calculateWeaningAndRearingPlan(req.body);
      return sendSuccess(
        res,
        result,
        "Planificación de destete y recría calculada con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateStockBalance(req, res, next) {
    try {
      const result = calculateHerdStockBalance(req.body);
      return sendSuccess(
        res,
        result,
        "Balance de stock y destete procesados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateDirectCosts(req, res, next) {
    try {
      const result = calculateDirectCostsAndBreakEven(req.body);
      return sendSuccess(
        res,
        result,
        "Costos directos, margen y punto de equilibrio calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  calculateBuySell(req, res, next) {
    try {
      const result = calculateBuySellMargin(req.body);
      return sendSuccess(
        res,
        result,
        "Relación compra-venta y margen calculados con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ZootechnicsController();
