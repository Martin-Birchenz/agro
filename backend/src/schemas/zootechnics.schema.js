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

export const carryingCapacitySchema = z.object({
  headCount: z.number().int().positive(),
  evPerHead: z.number().positive().default(1.0),
  surfaceHa: z.number().positive(),
  annualDmForageProdKgHa: z.number().positive(),
  forageUtilizationPercent: z.number().positive().max(100).default(50.0),
  annualDays: z.number().int().positive().default(365),
  dailyDmPerEvKg: z.number().positive().default(8.2),
});

export const antiparasiticSchema = z.object({
  avgWeightKg: z.number().positive(),
  dosePer50KgMl: z.number().positive(),
  headCount: z.number().int().positive().default(1),
  withdrawalPeriodDays: z.number().int().nonnegative().default(0),
  daysSinceApplication: z.number().int().nonnegative().default(0),
  daysUntilSale: z.number().int().nonnegative().default(0),
});

export const sanitaryCalendarSchema = z.object({
  headCount: z.number().int().positive(),
  heiferCalvesCount: z.number().int().nonnegative().default(0),
  aftosaDosesPerYear: z.number().int().nonnegative().default(2),
  clostridialDosesPerYear: z.number().int().nonnegative().default(2),
  reproductiveDosesPerYear: z.number().int().nonnegative().default(2),
  vaccineIntervalDays: z.number().int().positive().default(180),
  daysSinceLastVaccine: z.number().int().nonnegative().default(0),
});

export const bodyConditionSchema = z.object({
  currentScore: z.number().min(1).max(5),
  targetScore: z.number().min(1).max(5).default(3.0),
  targetPregnancyPercent: z.number().min(0).max(100).default(90.0),
  penaltyPerUnitPercent: z.number().min(0).max(100).default(15.0),
  kgPerScoreUnit: z.number().positive().default(32.0),
  daysToMating: z.number().int().positive().default(60),
});

export const strategicSupplementationSchema = z.object({
  requiredCmsKgDay: z.number().positive(),
  pastureOfferingKgDay: z.number().nonnegative(),
  substitutionRate: z.number().min(0).max(0.99).default(0.4),
  supplementDmPercent: z.number().positive().max(100).default(88.0),
  wastePercent: z.number().nonnegative().max(100).default(5.0),
  headCount: z.number().int().positive().default(1),
  feedingDays: z.number().int().positive().default(30),
});

export const weaningPlanSchema = z.object({
  weaningWeightKg: z.number().positive(),
  winterGdpvKgDay: z.number().nonnegative(),
  winterDays: z.number().int().positive().default(90),
  springGdpvKgDay: z.number().positive(),
  targetSaleWeightKg: z.number().positive(),
  headCount: z.number().int().positive().default(1),
  mortalityPercent: z.number().min(0).max(100).default(1.0),
});

export const herdStockBalanceSchema = z.object({
  initialStock: z.number().int().nonnegative(),
  entries: z.number().int().nonnegative().default(0),
  exits: z.number().int().nonnegative().default(0),
  actualStock: z.number().int().nonnegative(),
  weanedCalves: z.number().int().nonnegative().default(0),
  breedingCows: z.number().int().nonnegative().default(0),
});

export const directCostsSchema = z.object({
  feedingCost: z.number().nonnegative(),
  healthCost: z.number().nonnegative(),
  structureCost: z.number().nonnegative(),
  otherCosts: z.number().nonnegative().default(0),
  producedKg: z.number().positive(),
  surfaceHa: z.number().positive().default(1),
  salePricePerKg: z.number().positive(),
});

export const buySellMarginSchema = z.object({
  entryWeightKg: z.number().positive(),
  exitWeightKg: z.number().positive(),
  feederPricePerKg: z.number().positive(),
  fatPricePerKg: z.number().positive(),
  addedCostPerKgGained: z.number().nonnegative(),
});
