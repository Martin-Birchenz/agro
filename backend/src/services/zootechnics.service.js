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

/**
 * MÓDULO 02: FORMULACIÓN DE RACIÓN (Cuadrado de Pearson)
 * Mezcla binaria: Forraje base + Concentrado proteico
 * @param {Object} params
 * @param {number} params.targetCmsKgDay - Consumo total de MS objetivo (CMS_tot, kg MS/cab/día)
 * @param {number} params.forageCpPercent - % Proteína Bruta del forraje base (%PB_forr)
 * @param {number} params.concentrateCpPercent - % Proteína Bruta del concentrado (%PB_conc)
 * @param {number} params.targetCpPercent - % Proteína Bruta objetivo de la dieta total (%PB_obj)
 * @param {number} params.concentrateDmPercent - % Materia Seca del concentrado (%MS_conc, ej: 87.0)
 * @param {number} params.headCount - Cantidad de cabezas del lote (N)
 */

export const calculatePearsonRation = ({
  targetCmsKgDay,
  forageCpPercent,
  concentrateCpPercent,
  targetCpPercent,
  concentrateDmPercent = 87.0,
  headCount = 1,
}) => {
  // Validación biológica: el objetivo de PB debe estar estrictamente entre ambos alimentos
  if (
    targetCpPercent < forageCpPercent ||
    targetCpPercent > concentrateCpPercent
  ) {
    throw new Error(
      `La PB objetivo (${targetCpPercent}%) debe estar comprendida entre la PB del forraje (${forageCpPercent}%) y la del concentrado (${concentrateCpPercent}%).`,
    );
  }

  // Conc_MS = CMS_tot * ((PB_obj - PB_forr) / (PB_conc - PB_forr))
  const concentrateMsKgDay = Number(
    (
      targetCmsKgDay *
      ((targetCpPercent - forageCpPercent) /
        (concentrateCpPercent - forageCpPercent))
    ).toFixed(4),
  );

  // Forr_MS = CMS_tot - Conc_MS
  const forageMsKgDay = Number(
    (targetCmsKgDay - concentrateMsKgDay).toFixed(4),
  );

  // Conc_TC = Conc_MS / (%MS_conc / 100) (Kilos tal cual por animal/día)
  const concentrateTcKgDay = Number(
    (concentrateMsKgDay / (concentrateDmPercent / 100)).toFixed(2),
  );

  // Conc_lote = Conc_TC * N (Kilos tal cual diarios para todo el rodeo)
  const concentrateBatchTcKgDay = Number(
    (concentrateTcKgDay * headCount).toFixed(2),
  );

  return {
    concentrateMsKgDay,
    forageMsKgDay,
    concentrateTcKgDay,
    concentrateBatchTcKgDay,
  };
};

/**
 * MÓDULO 04: ASIGNACIÓN FORRAJERA Y FRANJAS
 * Pastoreo rotativo / parcelas diarias
 * @param {Object} params
 * @param {number} params.availableForageKgHa - Disponibilidad total de forraje (Disp, kg MS/ha)
 * @param {number} params.grazingEfficiencyPercent - Eficiencia de pastoreo / aprovechamiento (%EP, ej: 55.0)
 * @param {number} params.totalEv - Equivalencias Bovina totales del lote (EV_tot)
 * @param {number} params.evIntakeKgDay - Consumo estándar por EV (estándar: 8.2 o 10.0 kg MS/EV/día)
 * @param {number} params.occupationDays - Días de permanencia en la parcela (Días_oc, ej: 1)
 * @param {number} params.headCount - Cantidad de cabezas (N)
 */

export const calculateGrazingStrip = ({
  availableForageKgHa,
  grazingEfficiencyPercent = 55.0,
  totalEv,
  evIntakeKgDay = 10.0,
  occupationDays = 1,
  headCount = 1,
}) => {
  // Forraje aprovechable = Disp * (%EP / 100) (kg MS/ha)
  const usableForageKgHa = Number(
    (availableForageKgHa * (grazingEfficiencyPercent / 100)).toFixed(2),
  );

  if (usableForageKgHa <= 0) {
    throw new Error(
      "El forraje aprovechable no puede ser menor o igual a cero.",
    );
  }

  // Demanda total de la franja = EV_tot * Cons_EV * Días_oc (kg MS)
  const stripDemandKgMs = totalEv * evIntakeKgDay * occupationDays;

  // Sup_franja = Demanda / Forraje aprovechable (ha)
  const stripSurfaceHa = Number(
    (stripDemandKgMs / usableForageKgHa).toFixed(4),
  );
  const stripSurfaceM2 = Number((stripSurfaceHa * 10000).toFixed(1));

  // Asignación diaria individual = (EV_tot * Cons_EV * Días_oc) / ((%EP / 100) * N)
  const allowancePerHeadKgDay = Number(
    (stripDemandKgMs / ((grazingEfficiencyPercent / 100) * headCount)).toFixed(
      2,
    ),
  );

  return {
    usableForageKgHa,
    stripSurfaceHa,
    stripSurfaceM2,
    allowancePerHeadKgDay,
  };
};
