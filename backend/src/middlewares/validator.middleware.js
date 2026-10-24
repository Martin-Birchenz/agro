export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.issues) {
      return res.status(400).json({
        success: false,
        message: "Error de validación en los datos enviados",
        errors: error.issues
          ? error.issues.map((i) => ({
              field: i.path.join("."),
              message: i.message,
            }))
          : error.errors,
        timestamp: new Date().toISOString(),
      });
    }
    next(error);
  }
};
