import alertService from "../services/alert.service.js";
import { sendSuccess } from "../middlewares/response.middleware.js";

class AlertController {
  async getAlerts(req, res, next) {
    try {
      const alerts = await alertService.getZootechnicalAlerts();
      return sendSuccess(
        res,
        alerts,
        "Alertas sanitarias y de faena obtenidas con éxito",
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AlertController();
