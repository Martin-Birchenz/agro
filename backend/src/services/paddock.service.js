import paddockRepository from "../repositories/paddock.repository.js";
import {
  calculateNutritionalRequirements,
  calculateStockingRate,
  calculateGrazingStrip,
} from "./zootechnics.service.js";

class PaddockService {
  async getPaddockMetrics(paddockId) {
    const data = await paddockRepository.getPaddockWithHerd(paddockId);
    if (!data) return null;

    const { paddock, herd } = data;
    const headCount = herd.length;
    const superficieHa = Number(paddock.surface_ha);
    const biomasaDisponibleKgHa = Number(paddock.available_forage_kg_ha);
    const eficienciaAprovechamiento = Number(
      paddock.grazing_efficiency_percent,
    );

    if (headCount === 0) {
      return {
        potrero: {
          id: paddock.id,
          nombre: paddock.name,
          superficieHa,
          biomasaDisponibleKgHa,
          eficienciaAprovechamiento,
        },
        rodeo: {
          totalCabezas: 0,
          pesoPromedioKg: 0,
          evTotal: 0,
          cargaActualEvHa: 0,
        },
        mensaje:
          "No hay animales activos asignados a este potrero actualmente.",
      };
    }

    // 1. Consolidación de peso y EV total del lote
    let totalWeight = 0;
    let totalEv = 0;

    for (const animal of herd) {
      totalWeight += Number(animal.latest_weight);
      totalEv += Number(animal.ev_coefficient);
    }

    const avgWeight = totalWeight / headCount;

    // 2. Módulos 11 y 03: Presión de Carga
    const stocking = calculateStockingRate({
      headCount,
      evCoefficient: totalEv / headCount,
      surfaceHa: superficieHa,
    });

    // 3. Módulo 01: Demanda Nutricional y Reserva
    const nutrition = calculateNutritionalRequirements({
      weight: avgWeight,
      cmsPercent: 2.5,
      categoryFactor: 1.0,
      headCount,
    });

    // 4. Módulo 04: Dimensionamiento de Parcela Diaria
    const grazing = calculateGrazingStrip({
      availableForageKgHa: biomasaDisponibleKgHa,
      grazingEfficiencyPercent: eficienciaAprovechamiento,
      totalEv,
      evIntakeKgDay: 10.0,
      occupationDays: 1,
      headCount,
    });

    return {
      potrero: {
        id: paddock.id,
        nombre: paddock.name,
        superficieHa,
        biomasaDisponibleKgHa,
        eficienciaAprovechamiento,
      },
      rodeo: {
        totalCabezas: headCount,
        pesoPromedioKg: Number(avgWeight.toFixed(2)),
        evTotal: stocking.totalEv,
        cargaActualEvHa: stocking.stockingRateEvHa,
      },
      demandaAlimenticia: {
        cmsLoteKgDia: nutrition.batchCmsTotalKgDay,
        reserva90DiasTnMs: nutrition.reserve90DaysTons,
      },
      pastoreoRotativo: {
        superficieFranjaDiariaHa: grazing.stripSurfaceHa,
        superficieFranjaDiariaM2: grazing.stripSurfaceM2,
        asignacionPorCabezaKgDia: grazing.allowancePerHeadKgDay,
      },
    };
  }
}

export default new PaddockService();
