import { z } from "zod";

export const nutritionalCalculationSchema = z.object({
  weight: z
    .number({ required_error: "El peso vivo (weight) es obligatorio" })
    .positive("El peso debe ser mayor a 0 kg"),
  cmsPercent: z.number().positive().default(2.5),
  categoryFactor: z.number().positive().default(1.0),
  crudeProteinPercent: z.number().positive().default(12.0),
  metabolizableEnergy: z.number().positive().default(2.45),
  headCount: z.number().int().positive().default(1),
  surfaceHa: z.number().nonnegative().default(0),
  evCoefficient: z.number().positive().default(1.0),
});
