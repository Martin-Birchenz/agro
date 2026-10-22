export const sendSuccess = (
  res,
  data = null,
  message = "Operación exitosa",
  statusCode = 200,
  meta = null,
) => {
  const payload = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta !== null) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};
