import weighingService from "../services/weighing.service.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class WeighingController {
  async syncBatch(req, res, next) {
    try {
      const result = await weighingService.processBatchSync(req.body);
      return sendSuccess(
        res,
        result,
        "Lote sincronizado e integrado con éxito",
        201,
      );
    } catch (error) {
      next(error);
    }
  }
  async getByRfid(req, res, next) {
    try {
      const { rfidTag } = req.params;
      const data = await weighingService.getAnimalFiche(rfidTag);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Animal con caravana ${rfidTag} no encontrado`,
          timestamp: new Date().toISOString(),
        });
      }

      return sendSuccess(res, data, "Ficha zootécnica obtenida con éxito", 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new WeighingController();
