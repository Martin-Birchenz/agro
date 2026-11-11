import { Router } from "express";
import {
  listFarms,
  addFarm,
  listStock,
  addStockItem,
  updateStockQuantity,
} from "../controllers/admin.controller.js";

const router = Router();

// Establecimientos
router.get("/farms", listFarms);
router.post("/farms", addFarm);

// Insumos / Stock
router.get("/farms/:farmId/stock", listStock);
router.post("/stock", addStockItem);
router.patch("/stock/:id/adjust", updateStockQuantity);

export default router;
