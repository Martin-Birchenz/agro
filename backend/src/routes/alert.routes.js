import { Router } from "express";
import alertController from "../controllers/alert.controller.js";

const router = Router();

router.get("/", (req, res, next) => alertController.getAlerts(req, res, next));

export default router;
