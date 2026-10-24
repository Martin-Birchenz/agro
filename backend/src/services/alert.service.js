import alertRepository from "../repositories/alert.repository.js";

class AlertService {
  async getZootechnicalAlerts() {
    const herd = await alertRepository.getHerdStatusSummary();

    const readyForSale = [];
    const lowPerformance = [];

    for (const animal of herd) {
      const weight = Number(animal.current_weight);
      const targetWeight = Number(animal.target_sale_weight);
      const daysRemaining =
        animal.days_to_target_real !== null
          ? Number(animal.days_to_target_real)
          : null;
      const gdpvReal =
        animal.gdpv_real !== null ? Number(animal.gdpv_real) : null;

      // 1. Alerta de Venta/Faena: ya alcanzó el peso o faltan 15 días o menos
      if (
        weight >= targetWeight - 20 ||
        (daysRemaining !== null && daysRemaining <= 15)
      ) {
        readyForSale.push({
          animalId: animal.animal_id,
          rfidTag: animal.rfid_tag,
          paddock: animal.paddock_name || "Sin asignar",
          currentWeight: weight,
          targetWeight,
          daysRemaining: daysRemaining ?? 0,
          reason:
            weight >= targetWeight
              ? "Peso objetivo cumplido"
              : `Próximo a meta (${daysRemaining} días estimados)`,
        });
      }

      // 2. Alerta de Ganancia Deficiente (GDPV < 400 g/día)
      if (gdpvReal !== null && gdpvReal < 400) {
        lowPerformance.push({
          animalId: animal.animal_id,
          rfidTag: animal.rfid_tag,
          paddock: animal.paddock_name || "Sin asignar",
          currentWeight: weight,
          gdpvReal,
          targetGdpv: Number(animal.target_gdpv) * 1000,
          gap: gdpvReal - Number(animal.target_gdpv) * 1000,
          reason: "Ganancia de peso por debajo del umbral de rentabilidad",
        });
      }
    }

    return {
      totalAlerts: readyForSale.length + lowPerformance.length,
      readyForSale: {
        count: readyForSale.length,
        items: readyForSale,
      },
      lowPerformance: {
        count: lowPerformance.length,
        items: lowPerformance,
      },
    };
  }
}

export default new AlertService();
