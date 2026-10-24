import { Router } from "express";
import reportController from "../controllers/report.controller.js";

const router = Router();

router.get("/summary", (req, res, next) =>
  reportController.getHerdSummary(req, res, next),
);
router.get("/export/csv", (req, res, next) =>
  reportController.exportCsv(req, res, next),
);

export default router;
