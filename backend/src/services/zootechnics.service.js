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
