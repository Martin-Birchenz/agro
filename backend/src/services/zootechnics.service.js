/**
 * Motor zootécnico para el cálculo de evolución de peso vivo.
 * Basado en el Módulo 06: GDPV (Planilla Ganadera 2026).
 */
export const calculateGdpvMetrics = ({
  initialWeight,
  finalWeight,
  initialDate,
  finalDate,
  targetSaleWeight,
  targetGdpvKgDay = 0.85, // Objetivo por defecto en kg/día
}) => {
  const dStart = new Date(initialDate);
  const dEnd = new Date(finalDate);

  // Diferencia en milisegundos convertida a días reales
  const diffTime = dEnd.getTime() - dStart.getTime();
  const daysElapsed = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  const weightGain = Number((finalWeight - initialWeight).toFixed(2));

  // GDPV real en gramos/día: ((PVf - PVi) * 1000) / Días
  const gdpvReal = Number(((weightGain * 1000) / daysElapsed).toFixed(2));

  // Brecha frente al objetivo en gramos/día
  const targetGdpvGrams = targetGdpvKgDay * 1000;
  const gdpvGap = Number((gdpvReal - targetGdpvGrams).toFixed(2));

  // Kilos faltantes para alcanzar el peso final
  const remainingKg = Math.max(0, targetSaleWeight - finalWeight);

  // Días proyectados a faena según ganancia histórica real
  let daysToTargetReal = null;
  if (gdpvReal > 0) {
    const gdpvRealKgDay = gdpvReal / 1000;
    daysToTargetReal = Number((remainingKg / gdpvRealKgDay).toFixed(1));
  }

  // Días proyectados a faena según ganancia teórica objetivo
  const daysToTargetObjective = Number(
    (remainingKg / targetGdpvKgDay).toFixed(1),
  );

  return {
    daysElapsed,
    weightGain,
    gdpvReal,
    gdpvGap,
    daysToTargetReal,
    daysToTargetObjective,
  };
};

/**
 * MÓDULO 01: REQUERIMIENTO NUTRICIONAL (Planilla Ganadera 2026)
 * @param {Object} params
 * @param {number} params.weight - Peso vivo promedio (PV, kg)
 * @param {number} params.cmsPercent - % Consumo de MS sobre PV (ej: 2.5)
 * @param {number} params.categoryFactor - Factor de categoría (Fcat, ej: 1.0)
 * @param {number} params.crudeProteinPercent - % PB requerida en MS (ej: 12.0)
 * @param {number} params.metabolizableEnergy - Concentración EM (Mcal/kg MS, ej: 2.45)
 * @param {number} params.headCount - Número de animales en el lote (N)
 */

export const calculateNutritionalRequirements = ({
  weight,
  cmsPercent = 2.5,
  categoryFactor = 1.0,
  crudeProteinPercent = 12.0,
  metabolizableEnergy = 2.45,
  headCount = 1,
}) => {
  // CMS individual = PV * (%CMS / 100) * Fcat (kg MS/cab/día)
  const cmsIndividualKgDay = Number(
    (weight * (cmsPercent / 100) * categoryFactor).toFixed(2),
  );

  // PB individual = CMS * (%PB / 100) (kg PB/cab/día)
  const crudeProteinKgDay = Number(
    (cmsIndividualKgDay * (crudeProteinPercent / 100)).toFixed(2),
  );

  // EM individual = CMS * EM (Mcal EM/cab/día)
  const metabolizableEnergyMcalDay = Number(
    (cmsIndividualKgDay * metabolizableEnergy).toFixed(2),
  );

  // Demanda total del lote = CMS individual * N (kg MS/día)
  const batchCmsTotalKgDay = Number(
    (cmsIndividualKgDay * headCount).toFixed(2),
  );

  // Reserva de seguridad para 90 días = (Demanda lote * 90) / 1000 (tn MS)
  const reserve90DaysTons = Number(
    ((batchCmsTotalKgDay * 90) / 1000).toFixed(2),
  );

  return {
    cmsIndividualKgDay,
    crudeProteinKgDay,
    metabolizableEnergyMcalDay,
    batchCmsTotalKgDay,
    reserve90DaysTons,
  };
};

/**
 * MÓDULO 11 & 03: EQUIVALENCIA BOVINA Y CARGA ANIMAL
 * Coeficientes estándar oficiales:
 * - Vaca lactancia: 1.40
 * - Vaca seca: 0.60
 * - Vaquillona/novillito 1-2a: 0.70
 * - Vaquillona 2-3a y novillo >2a: 0.80
 * - Novillo pesado terminación: 1.00
 * - Ternero destetado: 0.60
 * - Toro: 1.30
 */

export const calculateStockingRate = ({
  headCount,
  evCoefficient = 1.0,
  surfaceHa = 0,
}) => {
  // EV totales = N * EV/cab
  const totalEv = Number((headCount * evCoefficient).toFixed(2));

  // Carga Animal = EV totales / Superficie (EV/ha)
  const stockingRateEvHa =
    surfaceHa > 0 ? Number((totalEv / surfaceHa).toFixed(2)) : 0;

  return {
    totalEv,
    stockingRateEvHa,
  };
};
