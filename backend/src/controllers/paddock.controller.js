import paddockService from "../services/paddock.service.js";
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
}

export default new PaddockController();
