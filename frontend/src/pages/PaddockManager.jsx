import { useState, useEffect } from "react";
import { getPaddockMetrics } from "../services/paddock.service";
import { Scale, TrendingUp, Calendar, AlertCircle } from "lucide-react";

export default function PaddockManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const result = await getPaddockMetrics(1); // Potrero 1 de prueba
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading)
    return <div className="card">Cargando métricas de pastoreo...</div>;
  if (error)
    return (
      <div className="card" style={{ color: "#dc2626" }}>
        Error: {error}
      </div>
    );
  if (!data) return null;

  const { potrero, rodeo, demandaAlimenticia, pastoreoRotativo } = data;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {potrero.nombre}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Superficie: {potrero.superficieHa} ha | Disponibilidad forrajera:{" "}
          {potrero.biomasaDisponibleKgHa} kg MS/ha
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid-metrics">
        <div className="metric-card">
          <div className="metric-label">Cabezas y Peso Vivo</div>
          <div className="metric-value">{rodeo.totalCabezas} cab</div>
          <div className="metric-sub">Promedio: {rodeo.pesoPromedioKg} kg</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Carga Animal Instantánea</div>
          <div className="metric-value">{rodeo.cargaActualEvHa} EV/ha</div>
          <div className="metric-sub">
            Total: {rodeo.evTotal} Equivalencias Vaca
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Demanda de Materia Seca</div>
          <div className="metric-value">
            {demandaAlimenticia.cmsLoteKgDia} kg/día
          </div>
          <div className="metric-sub">
            Reserva 90d: {demandaAlimenticia.reserva90DiasTnMs} tn MS
          </div>
        </div>

        <div
          className="metric-card"
          style={{ borderLeft: "4px solid var(--agro-green)" }}
        >
          <div className="metric-label">Boyero Eléctrico (Franja Diaria)</div>
          <div className="metric-value" style={{ color: "var(--agro-green)" }}>
            {pastoreoRotativo.superficieFranjaDiariaM2} m²
          </div>
          <div className="metric-sub">
            Equivalente a {pastoreoRotativo.superficieFranjaDiariaHa} ha/día
          </div>
        </div>
      </div>

      {/* Detalle Técnico de Manejo */}
      <div className="card">
        <h3
          style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}
        >
          Recomendación de Manejo Rotativo (Módulo 04)
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Para un lote con oferta forrajera de{" "}
          <strong>{potrero.biomasaDisponibleKgHa} kg MS/ha</strong> y una tasa
          de aprovechamiento estimada del{" "}
          <strong>{potrero.eficienciaAprovechamiento}%</strong>, la asignación
          requerida por cabeza es de{" "}
          <strong>
            {pastoreoRotativo.asignacionPorCabezaKgDia} kg MS/cab/día
          </strong>
          .
        </p>
      </div>
    </div>
  );
}
