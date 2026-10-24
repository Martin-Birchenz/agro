import { z } from "zod";

export const createPaddockSchema = z.object({
  fieldId: z.number().int().positive().default(1),
  name: z
    .string()
    .min(3, "El nombre del potrero debe tener al menos 3 caracteres"),
  surfaceHa: z.number().positive("La superficie debe ser mayor a 0"),
  availableForageKgHa: z.number().nonnegative().default(3500.0),
  grazingEfficiencyPercent: z.number().min(1).max(100).default(55.0),
});
