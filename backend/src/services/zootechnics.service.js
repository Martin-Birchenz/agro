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

/**
 * MÓDULO 05: CONVERSIÓN ALIMENTICIA (CA)
 * Eficiencia biológica de transformación de alimento en carne
 * @param {Object} params
 * @param {number} params.consumedDmKg - Total de Materia Seca consumida en el período (Cons_MS, kg MS)
 * @param {number} params.initialWeight - Peso vivo inicial (PV_i, kg)
 * @param {number} params.finalWeight - Peso vivo final (PV_f, kg)
 * @param {number} params.feedDmPercent - % de Materia Seca del alimento (%MS, ej: 88.0)
 * @param {number} params.headCount - Cantidad de cabezas del lote (N)
 * @param {number} params.mortalityPercent - % de mortandad estimada (%Mort, ej: 1.5)
 */

export const calculateFeedConversion = ({
  consumedDmKg,
  initialWeight,
  finalWeight,
  feedDmPercent = 88.0,
  headCount = 1,
  mortalityPercent = 0.0,
}) => {
  const gainPerHead = finalWeight - initialWeight;
  if (gainPerHead <= 0) {
    throw new Error(
      "El peso final debe ser mayor al peso inicial para calcular conversión alimenticia.",
    );
  }

  // CA_MS = Cons_MS / (PV_f - PV_i) (kg MS consumida / kg PV ganado)
  const caMs = Number((consumedDmKg / gainPerHead).toFixed(2));

  // CA_TC = (Cons_MS / (%MS / 100)) / (PV_f - PV_i) (kg Tal Cual / kg PV ganado)
  const feedTcKg = consumedDmKg / (feedDmPercent / 100);
  const caTc = Number((feedTcKg / gainPerHead).toFixed(2));

  // Kilos_lote = (PV_f - PV_i) * N * (1 - %Mort / 100) (Kilos netos producidos)
  const effectiveSurvivalFactor = Math.max(0, 1 - mortalityPercent / 100);
  const batchTotalGainKg = Number(
    (gainPerHead * headCount * effectiveSurvivalFactor).toFixed(2),
  );

  return {
    gainPerHeadKg: Number(gainPerHead.toFixed(2)),
    caMs,
    caTc,
    batchTotalGainKg,
  };
};

/**
 * MÓDULO 09: BALANCE HÍDRICO GANADERO
 * Requerimiento de agua con estrés térmico y autonomía de reserva
 * @param {Object} params
 * @param {number} params.cmsKgDay - Consumo de Materia Seca diario (CMS, kg MS/cab/día)
 * @param {number} params.categoryFactor - Factor de categoría (F_cat, ej: 1.0)
 * @param {number} params.ambientTempC - Temperatura ambiente (°C)
 * @param {number} params.heatIncrementPercent - % incremento por cada °C arriba de 25°C (%Calor, ej: 4.0)
 * @param {number} params.headCount - Número de animales (N)
 * @param {number} params.tankCapacityLiters - Capacidad del tanque o aguada (L)
 * @param {number} params.baseWaterLPerKgMs - Litros base por kg MS (estándar: 4.0 L/kg MS)
 */

export const calculateWaterBalance = ({
  cmsKgDay,
  categoryFactor = 1.0,
  ambientTempC = 20.0,
  heatIncrementPercent = 4.0,
  headCount = 1,
  tankCapacityLiters = 0,
  baseWaterLPerKgMs = 4.0,
}) => {
  // Agua_base = Cons_base * CMS * F_cat (L/cab/día)
  const baseWaterPerHeadLDay = baseWaterLPerKgMs * cmsKgDay * categoryFactor;

  // Grados por encima de 25 °C que disparan estrés calórico
  const excessTemp = Math.max(0, ambientTempC - 25.0);

  // Agua_calor = Agua_base * [max(0, Temp - 25) * (%Calor / 100)]
  const heatStressWaterLDay =
    baseWaterPerHeadLDay * (excessTemp * (heatIncrementPercent / 100));

  // Agua_cab = Agua_base + Agua_calor
  const totalWaterPerHeadLDay = Number(
    (baseWaterPerHeadLDay + heatStressWaterLDay).toFixed(2),
  );

  // Demanda total del lote = Agua_cab * N
  const batchWaterTotalLDay = Number(
    (totalWaterPerHeadLDay * headCount).toFixed(2),
  );

  // Autonomía = Tanque / (Agua_cab * N) (días de reserva)
  let tankAutonomyDays = null;
  if (tankCapacityLiters > 0 && batchWaterTotalLDay > 0) {
    tankAutonomyDays = Number(
      (tankCapacityLiters / batchWaterTotalLDay).toFixed(2),
    );
  }

  return {
    baseWaterPerHeadLDay: Number(baseWaterPerHeadLDay.toFixed(2)),
    heatStressWaterLDay: Number(heatStressWaterLDay.toFixed(2)),
    totalWaterPerHeadLDay,
    batchWaterTotalLDay,
    tankAutonomyDays,
  };
};

/**
 * MÓDULO 03: CARGA ANIMAL Y RECEPTIVIDAD FORRAJERA
 */

export const calculateStockingAndCarryingCapacity = ({
  headCount,
  evPerHead = 1.0,
  surfaceHa,
  annualDmForageProdKgHa,
  forageUtilizationPercent = 50.0,
  annualDays = 365,
  dailyDmPerEvKg = 8.2, // Estándar oficial INTA: 8.2 kg MS/EV/día
}) => {
  if (surfaceHa <= 0) throw new Error("La superficie debe ser mayor a 0 ha.");

  const totalEv = Number((headCount * evPerHead).toFixed(2));
  const currentStockingEvHa = Number((totalEv / surfaceHa).toFixed(2));
  const annualDemandPerEvKg = dailyDmPerEvKg * annualDays; // ~2993 kg MS/EV/año

  const usableForageKgHa =
    annualDmForageProdKgHa * (forageUtilizationPercent / 100);
  const carryingCapacityEvHa = Number(
    (usableForageKgHa / annualDemandPerEvKg).toFixed(2),
  );
  const totalCarryingCapacityEv = carryingCapacityEvHa * surfaceHa;
  const evBalance = Number((totalCarryingCapacityEv - totalEv).toFixed(2));

  return {
    totalEv,
    currentStockingEvHa,
    annualDemandPerEvKg,
    carryingCapacityEvHa,
    evBalance,
  };
};

/**
 * MÓDULO 07: DOSIFICACIÓN DE ANTIPARASITARIOS Y RETIRO
 */

export const calculateAntiparasiticDosing = ({
  avgWeightKg,
  dosePer50KgMl,
  headCount = 1,
  withdrawalPeriodDays = 0,
  daysSinceApplication = 0,
  daysUntilSale = 0,
}) => {
  // Dosis_cab = PV_prom * (Dosis_50 / 50) (mL/cab)
  const dosePerHeadMl = Number((avgWeightKg * (dosePer50KgMl / 50)).toFixed(2));
  const totalVolumeMl = Number((dosePerHeadMl * headCount).toFixed(2));
  const remainingWithdrawalDays = Math.max(
    0,
    withdrawalPeriodDays - daysSinceApplication,
  );
  const safetyMarginDays = daysUntilSale - remainingWithdrawalDays;

  return {
    dosePerHeadMl,
    totalVolumeMl,
    remainingWithdrawalDays,
    safetyMarginDays,
    canBeMarketed: remainingWithdrawalDays === 0,
  };
};

/**
 * MÓDULO 08: CALENDARIO SANITARIO ANUAL
 */

export const calculateSanitaryCalendar = ({
  headCount,
  heiferCalvesCount = 0,
  aftosaDosesPerYear = 2,
  clostridialDosesPerYear = 2,
  reproductiveDosesPerYear = 2,
  vaccineIntervalDays = 180,
  daysSinceLastVaccine = 0,
}) => {
  const totalAnnualDoses =
    headCount *
      (aftosaDosesPerYear +
        clostridialDosesPerYear +
        reproductiveDosesPerYear) +
    heiferCalvesCount; // Brucelosis en terneras
  const daysToNextApplication = Math.max(
    0,
    vaccineIntervalDays - daysSinceLastVaccine,
  );

  return {
    totalAnnualDoses,
    daysToNextApplication,
  };
};

/**
 * MÓDULO 10: CONDICIÓN CORPORAL (CC) Y PREÑEZ PROYECTADA
 */

export const calculateBodyConditionAndPregnancy = ({
  currentScore,
  targetScore = 3.0,
  targetPregnancyPercent = 90.0,
  penaltyPerUnitPercent = 15.0,
  kgPerScoreUnit = 32.0, // Promedio 30-35 kg por punto de CC escala 1-5
  daysToMating = 60,
}) => {
  const scoreGap = Math.max(0, targetScore - currentScore);
  const estimatedPregnancyPercent = Number(
    Math.max(
      0,
      Math.min(
        targetPregnancyPercent,
        targetPregnancyPercent - scoreGap * penaltyPerUnitPercent,
      ),
    ).toFixed(2),
  );

  const kgToRecover = Number((scoreGap * kgPerScoreUnit).toFixed(2));
  const requiredGdpvKgDay =
    daysToMating > 0 && kgToRecover > 0
      ? Number((kgToRecover / daysToMating).toFixed(3))
      : 0;

  return {
    scoreGap: Number(scoreGap.toFixed(2)),
    estimatedPregnancyPercent,
    kgToRecover,
    requiredGdpvKgDay,
  };
};

/**
 * MÓDULO 12: SUPLEMENTACIÓN ESTRATÉGICA Y TASA DE SUSTITUCIÓN
 */

export const calculateStrategicSupplementation = ({
  requiredCmsKgDay,
  pastureOfferingKgDay,
  substitutionRate = 0.4, // Tasa de sustitución estándar (0 a 1)
  supplementDmPercent = 88.0,
  wastePercent = 5.0,
  headCount = 1,
  feedingDays = 30,
}) => {
  if (substitutionRate >= 1)
    throw new Error("La tasa de sustitución debe ser menor a 1.0.");

  // Supl_MS = (CMS_req - Oferta_pasto) / (1 - T_sust)
  const deficit = Math.max(0, requiredCmsKgDay - pastureOfferingKgDay);
  const supplementDmKgDay = Number(
    (deficit / (1 - substitutionRate)).toFixed(2),
  );

  // Supl_TC = (Supl_MS / (%MS / 100)) * (1 + %Perd / 100)
  const supplementTcKgDay = Number(
    (
      (supplementDmKgDay / (supplementDmPercent / 100)) *
      (1 + wastePercent / 100)
    ).toFixed(2),
  );

  // Forr_ahorrado = (Supl_MS * T_sust * N * Dias) / 1000 (tn MS)
  const savedForageTons = Number(
    (
      (supplementDmKgDay * substitutionRate * headCount * feedingDays) /
      1000
    ).toFixed(2),
  );

  return {
    supplementDmKgDay,
    supplementTcKgDay,
    savedForageTons,
  };
};

/**
 * MÓDULO 13: PLANIFICACIÓN DE DESTETE Y RECRÍA
 */

export const calculateWeaningAndRearingPlan = ({
  weaningWeightKg,
  winterGdpvKgDay,
  winterDays = 90,
  springGdpvKgDay,
  targetSaleWeightKg,
  headCount = 1,
  mortalityPercent = 1.0,
}) => {
  // PV_salida_inv = PV_d + (GDPV_inv * Dias_inv)
  const springEntryWeightKg = Number(
    (weaningWeightKg + winterGdpvKgDay * winterDays).toFixed(2),
  );

  const remainingKgSpring = Math.max(
    0,
    targetSaleWeightKg - springEntryWeightKg,
  );
  const springDays =
    springGdpvKgDay > 0 ? Math.round(remainingKgSpring / springGdpvKgDay) : 0;
  const totalDays = winterDays + springDays;

  // Prod_carne = (PV_obj - PV_d) * N * (1 - %Mort / 100)
  const netWeightGain = targetSaleWeightKg - weaningWeightKg;
  const batchMeatProducedKg = Number(
    (netWeightGain * headCount * (1 - mortalityPercent / 100)).toFixed(2),
  );

  return {
    springEntryWeightKg,
    springDays,
    totalDays,
    batchMeatProducedKg,
  };
};

/**
 * MÓDULO 14: FICHA DE RODEO Y BALANCE DE STOCK
 */

export const calculateHerdStockBalance = ({
  initialStock,
  entries = 0,
  exits = 0,
  actualStock,
  weanedCalves = 0,
  breedingCows = 0,
}) => {
  // Stock_teorico = Stock_ini + Entradas - Salidas
  const theoreticalStock = initialStock + entries - exits;
  const discrepancy = theoreticalStock - actualStock;

  // % Destete = (Destetados / Vientres) * 100
  const weaningPercent =
    breedingCows > 0
      ? Number(((weanedCalves / breedingCows) * 100).toFixed(2))
      : null;

  return {
    theoreticalStock,
    discrepancy,
    hasDiscrepancy: discrepancy !== 0,
    weaningPercent,
  };
};

/**
 * MÓDULO 15: COSTO DIRECTO DEL KILO Y PRECIO DE INDIFERENCIA
 */

export const calculateDirectCostsAndBreakEven = ({
  feedingCost,
  healthCost,
  structureCost,
  otherCosts = 0,
  producedKg,
  surfaceHa = 1,
  salePricePerKg,
}) => {
  if (producedKg <= 0)
    throw new Error("Los kilos producidos deben ser mayores a 0.");

  const totalCost = feedingCost + healthCost + structureCost + otherCosts;
  const costPerKgProduced = Number((totalCost / producedKg).toFixed(2));

  // MB_ha = ((Precio_kg * Prod_kg) - Costo_tot) / Sup
  const grossMarginTotal = salePricePerKg * producedKg - totalCost;
  const grossMarginPerHa = Number((grossMarginTotal / surfaceHa).toFixed(2));

  // Kg_equilibrio = Costo_tot / Precio_kg
  const breakEvenKg = Number((totalCost / salePricePerKg).toFixed(2));

  return {
    totalCost,
    costPerKgProduced,
    grossMarginTotal,
    grossMarginPerHa,
    breakEvenKg,
  };
};

/**
 * MÓDULO 16: RELACIÓN COMPRA-VENTA Y MARGEN DE INVERNADA
 */

export const calculateBuySellMargin = ({
  entryWeightKg,
  exitWeightKg,
  feederPricePerKg, // $/kg Ternero / Invernada
  fatPricePerKg, // $/kg Gordo
  addedCostPerKgGained, // Costo de engorde por kg agregado
}) => {
  if (exitWeightKg <= entryWeightKg) {
    throw new Error("El peso de salida debe ser mayor al peso de entrada.");
  }

  // Rel_CV = P_flaco / P_gordo
  const buySellRatio = Number((feederPricePerKg / fatPricePerKg).toFixed(3));

  // MB_cab = (PV_out * P_gordo) - (PV_in * P_flaco) - ((PV_out - PV_in) * Cost_agreg)
  const weightGain = exitWeightKg - entryWeightKg;
  const grossRevenue = exitWeightKg * fatPricePerKg;
  const animalPurchaseCost = entryWeightKg * feederPricePerKg;
  const fatteningCost = weightGain * addedCostPerKgGained;

  const grossMarginPerHead = Number(
    (grossRevenue - animalPurchaseCost - fatteningCost).toFixed(2),
  );

  // Cost_eq = ((PV_out * P_gordo) - (PV_in * P_flaco)) / (PV_out - PV_in)
  const breakEvenCostPerKgGained = Number(
    ((grossRevenue - animalPurchaseCost) / weightGain).toFixed(2),
  );

  return {
    buySellRatio,
    grossMarginPerHead,
    breakEvenCostPerKgGained,
  };
};
