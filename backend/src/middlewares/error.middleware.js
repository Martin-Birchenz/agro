import { ZodError } from "zod";

export class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(">>> [ERROR CAPTURADO]:", err);

  // 1. Error de validación Zod
  if (err instanceof ZodError) {
    const details = (err.issues || err.errors || []).map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Fallo de validación en los datos de entrada",
      errors: details,
      timestamp: new Date().toISOString(),
    });
  }

  // Colisión de idempotencia o duplicidad nativa en MySQL
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "Registro duplicado detectado (clave única violada)",
      detail: err.sqlMessage,
      timestamp: new Date().toISOString(),
    });
  }

  // Error controlado de negocio / zootécnico
  if (err instanceof DomainError || err.statusCode) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Error no previsto
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    timestamp: new Date().toISOString(),
  });
};
