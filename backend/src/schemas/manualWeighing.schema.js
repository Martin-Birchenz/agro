import { z } from "zod";

export const manualWeighingSchema = z.object({
  rfidTag: z
    .string()
    .min(1, "La caravana es obligatoria")
    .max(15, "Máximo 15 dígitos"),
  weightKg: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .max(1500, "Peso fuera de rango"),
  weighedAt: z
    .string()
    .datetime()
    .optional()
    .default(() => new Date().toISOString()),
  targetWeightKg: z.number().positive().optional().default(420.0), // Peso objetivo a faena por defecto
  notes: z.string().max(255).optional(),
});
