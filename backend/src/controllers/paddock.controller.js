import paddockService from "../services/paddock.service.js";
import paddockRepository from "../repositories/paddock.repository.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class PaddockController {
  async getMetrics(req, res, next) {
    try {
      const { paddockId } = req.params;
      const metrics = await paddockService.getPaddockMetrics(Number(paddockId));

      if (!metrics) {
        return res.status(404).json({
          success: false,
          message: `Potrero con ID ${paddockId} no encontrado.`,
          timestamp: new Date().toISOString(),
        });
      }

      return sendSuccess(
        res,
        metrics,
        "Métricas de pastoreo y carga calculadas con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  async moveAnimal(req, res, next) {
    try {
      const { animalId } = req.params;
      const { newPaddockId } = req.body;

      const updated = await paddockService.moveAnimalToPaddock(
        Number(animalId),
        Number(newPaddockId),
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "No se pudo reasignar el animal al nuevo potrero.",
          timestamp: new Date().toISOString(),
        });
      }

      return sendSuccess(
        res,
        { animalId, newPaddockId },
        "Animal trasladado de potrero con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
  async getAll(req, res, next) {
    try {
      const paddocks = await paddockRepository.getAllPaddocks();
      return sendSuccess(
        res,
        paddocks,
        "Listado de potreros obtenido con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const insertId = await paddockRepository.createPaddock(req.body);
      return sendSuccess(
        res,
        { id: insertId, ...req.body },
        "Potrero creado con éxito",
        201,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PaddockController();
