import {
  createFarmSchema,
  createStockItemSchema,
  adjustStockSchema,
} from "../schemas/admin.schema.js";
import * as adminService from "../services/admin.service.js";

export const listFarms = async (req, res, next) => {
  try {
    const clientId = Number(req.query.clientId) || 1;
    const farms = await adminService.getFarmsByClient(clientId);
    res.json({ success: true, data: farms });
  } catch (error) {
    next(error);
  }
};

export const addFarm = async (req, res, next) => {
  try {
    const validatedData = createFarmSchema.parse(req.body);
    const newFarm = await adminService.createFarm(validatedData);
    res.status(201).json({ success: true, data: newFarm });
  } catch (error) {
    next(error);
  }
};

export const listStock = async (req, res, next) => {
  try {
    const farmId = Number(req.params.farmId);
    const { category } = req.query;
    const stock = await adminService.getStockByFarm(farmId, category);
    res.json({ success: true, data: stock });
  } catch (error) {
    next(error);
  }
};

export const addStockItem = async (req, res, next) => {
  try {
    const validatedData = createStockItemSchema.parse(req.body);
    const item = await adminService.createStockItem(validatedData);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateStockQuantity = async (req, res, next) => {
  try {
    const stockItemId = Number(req.params.id);
    const { deltaQuantity } = adjustStockSchema.parse(req.body);
    const result = await adminService.adjustStockQuantity(
      stockItemId,
      deltaQuantity,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
