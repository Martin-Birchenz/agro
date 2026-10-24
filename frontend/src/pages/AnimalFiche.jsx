import { useState, useEffect } from "react";
import { getAnimalFiche } from "../services/weighing.service";

export default function AnimalFiche() {
  const [rfidTag, setRfidTag] = useState("982000555666777");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiche = async (tag) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAnimalFiche(tag);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiche(rfidTag);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Trazabilidad Individual ISO 11784/11785
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Evolución cronológica y métricas zootécnicas
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={rfidTag}
            onChange={(e) => setRfidTag(e.target.value)}
            placeholder="Caravana RFID de 15 dígitos"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              fontSize: "0.9rem",
              width: "220px",
            }}
          />
          <button
            onClick={() => fetchFiche(rfidTag)}
            style={{
              backgroundColor: "var(--agro-green)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Consultar
          </button>
        </div>
      </div>

      {loading && <div className="card">Cargando ficha zootécnica...</div>}
      {error && (
        <div className="card" style={{ color: "#dc2626" }}>
          Error: {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid-metrics">
            <div className="metric-card">
              <div className="metric-label">Caravana RFID</div>
              <div className="metric-value" style={{ fontSize: "1.3rem" }}>
                {data.trazabilidad.rfidTag}
              </div>
              <div className="metric-sub">
                {data.trazabilidad.categoria} ({data.trazabilidad.sexo})
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Último Peso Registrado</div>
              <div className="metric-value">
                {data.estadoActual?.ultimoPesoKg ?? "--"} kg
              </div>
              <div className="metric-sub">
                Meta de venta: {data.objetivos.pesoVentaObjetivoKg} kg
              </div>
            </div>

            <div
              className="metric-card"
              style={{ borderLeft: "4px solid var(--agro-blue)" }}
            >
              <div className="metric-label">GDPV Lograda (Módulo 06)</div>
              <div
                className="metric-value"
                style={{ color: "var(--agro-blue)" }}
              >
                {data.estadoActual?.gdpvActualGramosDia ?? "--"} g/día
              </div>
              <div className="metric-sub">
                Objetivo: {data.objetivos.gdpvObjetivoKgDia * 1000} g/día
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Proyección a Venta/Faena</div>
              <div className="metric-value">
                {data.estadoActual?.diasRestantesFaena ?? "--"} días
              </div>
              <div className="metric-sub">
                Estimado al ritmo de ganancia real
              </div>
            </div>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Serie Histórica de Balanza
            </h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Transacción</th>
                    <th>Fecha y Hora</th>
                    <th>Peso (kg)</th>
                    <th>Días</th>
                    <th>Ganancia (kg)</th>
                    <th>GDPV Real (g/día)</th>
                    <th>Δ Brecha (g/día)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pesajesHistoricos.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "monospace" }}>
                        {p.client_transaction_id}
                      </td>
                      <td>{new Date(p.weighed_at).toLocaleDateString()}</td>
                      <td>
                        <strong>{p.weight} kg</strong>
                      </td>
                      <td>{p.days_elapsed ?? "-"}</td>
                      <td>{p.weight_gain ? `+${p.weight_gain} kg` : "-"}</td>
                      <td>
                        {p.gdpv_real ? (
                          <span className="badge badge-green">
                            {p.gdpv_real} g/d
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>
                            Base inicial
                          </span>
                        )}
                      </td>
                      <td>{p.gdpv_gap !== null ? `${p.gdpv_gap} g/d` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
