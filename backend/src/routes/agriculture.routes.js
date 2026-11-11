import { Router } from "express";
import agricultureController from "../controllers/agriculture.controller.js";

const router = Router();

router.get("/farms/:farmId/plots", (req, res, next) =>
  agricultureController.getPlotsByFarm(req, res, next),
);
router.post("/plots", (req, res, next) =>
  agricultureController.createPlot(req, res, next),
);

router.post("/labors", (req, res, next) =>
  agricultureController.registerLabor(req, res, next),
);

router.post("/campaigns", (req, res, next) =>
  agricultureController.createCampaign(req, res, next),
);
router.get("/farms/:farmId/gross-margin", (req, res, next) =>
  agricultureController.getGrossMargins(req, res, next),
);

export default router;
