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

export const pearsonRationSchema = z.object({
  targetCmsKgDay: z
    .number()
    .positive("El consumo de MS objetivo debe ser mayor a 0"),
  forageCpPercent: z
    .number()
    .nonnegative("El % de PB del forraje no puede ser negativo"),
  concentrateCpPercent: z
    .number()
    .positive("El % de PB del concentrado debe ser mayor a 0"),
  targetCpPercent: z
    .number()
    .positive("El % de PB objetivo debe ser mayor a 0"),
  concentrateDmPercent: z.number().positive().default(87.0),
  headCount: z.number().int().positive().default(1),
});

export const grazingStripSchema = z.object({
  availableForageKgHa: z
    .number()
    .positive("La disponibilidad debe ser mayor a 0 kg MS/ha"),
  grazingEfficiencyPercent: z.number().positive().max(100).default(55.0),
  totalEv: z.number().positive("Las EV totales deben ser mayores a 0"),
  evIntakeKgDay: z.number().positive().default(10.0),
  occupationDays: z.number().int().positive().default(1),
  headCount: z.number().int().positive().default(1),
});

export const feedConversionSchema = z.object({
  consumedDmKg: z.number().positive("El consumo de MS debe ser mayor a 0 kg"),
  initialWeight: z.number().positive("El peso inicial debe ser mayor a 0 kg"),
  finalWeight: z.number().positive("El peso final debe ser mayor a 0 kg"),
  feedDmPercent: z.number().positive().max(100).default(88.0),
  headCount: z.number().int().positive().default(1),
  mortalityPercent: z.number().min(0).max(100).default(0.0),
});

export const waterBalanceSchema = z.object({
  cmsKgDay: z.number().positive("El CMS diario debe ser mayor a 0 kg"),
  categoryFactor: z.number().positive().default(1.0),
  ambientTempC: z.number().default(20.0),
  heatIncrementPercent: z.number().min(0).default(4.0),
  headCount: z.number().int().positive().default(1),
  tankCapacityLiters: z.number().nonnegative().default(0),
  baseWaterLPerKgMs: z.number().positive().default(4.0),
});
