import { z } from "zod";

export const createManualAnimalSchema = z.object({
  rfidTag: z
    .string()
    .length(15, "La caravana RFID debe tener exactamente 15 dígitos"),
  visualTag: z.string().optional().nullable(),
  categoryId: z.number().int().positive(),
  paddockId: z.number().int().positive().optional().nullable(),
  targetSaleWeight: z.number().positive().default(340.0),
  targetGdpv: z.number().positive().default(0.85),
  initialWeight: z.number().positive("El peso inicial debe ser mayor a 0"),
});
