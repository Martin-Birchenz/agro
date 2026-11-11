import { z } from "zod";

export const createFarmSchema = z.object({
  clientId: z.number().int().positive("ID de cliente inválido"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120),
  location: z.string().max(150).optional(),
  totalSurfaceHa: z
    .number()
    .nonnegative("La superficie no puede ser negativa")
    .default(0),
});

export const createStockItemSchema = z.object({
  farmId: z.number().int().positive("ID de establecimiento inválido"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120),
  category: z.enum([
    "SEMILLA",
    "FERTILIZANTE",
    "FITOSANITARIO",
    "VETERINARIA",
    "COMBUSTIBLE",
    "RACION",
  ]),
  unitOfMeasure: z.string().min(1).max(20), // 'kg', 'lt', 'dosis', 'bolsa'
  currentQuantity: z
    .number()
    .nonnegative("La cantidad no puede ser negativa")
    .default(0),
  minQuantityAlert: z.number().nonnegative().optional().default(0),
  costPerUnitUsd: z.number().nonnegative().optional().default(0),
});

export const adjustStockSchema = z.object({
  deltaQuantity: z.number(), // Puede ser positivo (ingreso) o negativo (consumo)
  reason: z.string().max(255).optional(),
});
