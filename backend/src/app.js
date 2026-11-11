import express from "express";
import cors from "cors";
import weighingRoutes from "./routes/weighing.routes.js";
import zootechnicsRoutes from "./routes/zootechnics.routes.js";
import paddockRoutes from "./routes/paddock.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import animalRoutes from "./routes/animal.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import agricultureRoutes from "./routes/agriculture.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use("/api/weighings", weighingRoutes);
app.use("/api/zootechnics", zootechnicsRoutes);
app.use("/api/paddocks", paddockRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agriculture", agricultureRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "online", timestamp: new Date().toISOString() });
});

// Middleware global de errores
app.use(errorHandler);

export default app;
