import pool from "../config/db.js";
import weighingRepository from "../repositories/weighing.repository.js";
import { calculateGdpvMetrics } from "./zootechnics.service.js";

class WeighingService {
  async processBatchSync(batchData) {
    const { deviceId, weighings } = batchData;
    const connection = await pool.getConnection();

    const summary = {
      totalReceived: weighings.length,
      processed: 0,
      skippedDuplicates: 0,
      records: [],
    };

    try {
      await connection.beginTransaction();

      // Ordenar cronológicamente el lote antes de procesarlo
      const sortedWeighings = [...weighings].sort(
        (a, b) =>
          new Date(a.weighedAt).getTime() - new Date(b.weighedAt).getTime(),
      );

      for (const item of sortedWeighings) {
        // 1. Control de Idempotencia
        const alreadyExists = await weighingRepository.isTransactionProcessed(
          item.clientTransactionId,
          connection,
        );

        if (alreadyExists) {
          summary.skippedDuplicates += 1;
          continue;
        }

        // 2. Obtener o crear animal
        let animal = await weighingRepository.findAnimalByRfid(
          item.rfidTag,
          connection,
        );
        let animalId;

        if (!animal) {
          animalId = await weighingRepository.createDefaultAnimal(
            item.rfidTag,
            1,
            connection,
          );
          animal = {
            id: animalId,
            target_sale_weight: 340.0,
            target_gdpv: 0.85,
          };
        } else {
          animalId = animal.id;
        }

        // 3. Buscar el pesaje inmediatamente anterior en el tiempo
        const previousWeighing = await weighingRepository.getPreviousWeighing(
          animalId,
          item.weighedAt,
          connection,
        );

        // 4. Cálculo Zootécnico (Módulo 06: GDPV)
        let metrics = {
          daysElapsed: null,
          weightGain: null,
          gdpvReal: null,
          gdpvGap: null,
          daysToTargetReal: null,
          daysToTargetObjective: null,
        };

        if (previousWeighing) {
          metrics = calculateGdpvMetrics({
            initialWeight: Number(previousWeighing.weight),
            finalWeight: item.weight,
            initialDate: previousWeighing.weighed_at,
            finalDate: item.weighedAt,
            targetSaleWeight: Number(animal.target_sale_weight),
            targetGdpvKgDay: Number(animal.target_gdpv),
          });
        }

        // 5. Inserción
        const insertId = await weighingRepository.insertWeighing(
          {
            clientTransactionId: item.clientTransactionId,
            animalId,
            weight: item.weight,
            weighedAt: item.weighedAt,
            deviceId,
            ...metrics,
          },
          connection,
        );

        summary.processed += 1;
        summary.records.push({
          id: insertId,
          rfidTag: item.rfidTag,
          weight: item.weight,
          gdpvReal: metrics.gdpvReal,
          daysToTargetReal: metrics.daysToTargetReal,
        });
      }

      await connection.commit();
      return summary;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async getAnimalFiche(rfidTag) {
    const data = await weighingRepository.getAnimalHistory(rfidTag);
    if (!data) return null;

    const { animal, history } = data;
    const latestWeighing =
      history.length > 0 ? history[history.length - 1] : null;

    return {
      trazabilidad: {
        rfidTag: animal.rfid_tag,
        visualTag: animal.visual_tag,
        categoria: animal.category_name,
        sexo: animal.sex,
        equivalenciaVaca: animal.ev_coefficient,
      },
      objetivos: {
        pesoVentaObjetivoKg: Number(animal.target_sale_weight),
        gdpvObjetivoKgDia: Number(animal.target_gdpv),
      },
      estadoActual: latestWeighing
        ? {
            ultimoPesoKg: Number(latestWeighing.weight),
            ultimaFecha: latestWeighing.weighed_at,
            gdpvActualGramosDia:
              latestWeighing.gdpv_real !== null
                ? Number(latestWeighing.gdpv_real)
                : null,
            diasRestantesFaena:
              latestWeighing.days_to_target_real !== null
                ? Number(latestWeighing.days_to_target_real)
                : null,
          }
        : null,
      pesajesHistoricos: history,
    };
  }
}

export default new WeighingService();
