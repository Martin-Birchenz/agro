import { z } from "zod";

const weighingItemSchema = z.object({
  clientTransactionId: z
    .string({ required_error: "El clientTransactionId es obligatorio" })
    .min(8, "El ID de transacción debe tener al menos 8 caracteres"),
  rfidTag: z
    .string({ required_error: "La caravana RFID es obligatoria" })
    .regex(
      /^\d{15}$/,
      "La caravana RFID debe contener 15 dígitos numéricos (ISO 11784/11785)",
    ),
  weight: z
    .number({ required_error: "El peso es obligatorio" })
    .positive("El peso debe ser mayor a 0 kg")
    .max(1500, "El peso registrado excede el límite biológico"),
  weighedAt: z
    .string({ required_error: "La marca temporal es obligatoria" })
    .datetime({
      message:
        "La fecha debe estar en formato ISO 8601 (ej: YYYY-MM-DDTHH:mm:ssZ)",
    }),
});

export const batchWeighingSchema = z.object({
  deviceId: z
    .string({ required_error: "El identificador del hardware es obligatorio" })
    .min(3, "El deviceId debe tener al menos 3 caracteres"),
  weighings: z
    .array(weighingItemSchema, {
      required_error: "La lista de pesajes es obligatoria",
    })
    .min(1, "El lote debe contener al menos un registro de pesaje"),
});
