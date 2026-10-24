import { useState, useEffect } from "react";
import {
  getPaddockMetrics,
  moveAnimalPaddock,
} from "../services/paddock.service";
import {
  Compass,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  AlertOctagon,
  TrendingDown,
  CheckCircle,
} from "lucide-react";
import { getZootechnicalAlerts } from "../services/alert.service";

export default function PaddockManager() {
  const [currentPaddockId, setCurrentPaddockId] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferTarget, setTransferTarget] = useState(2);
  const [transferMessage, setTransferMessage] = useState(null);
  const [alertsData, setAlertsData] = useState(null);

  const loadMetrics = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPaddockMetrics(id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(currentPaddockId);
    getZootechnicalAlerts()
      .then((res) => setAlertsData(res))
      .catch((err) => console.error("Error cargando alertas:", err));
  }, [currentPaddockId]);

  const handleTransfer = async (animalId) => {
    try {
      setTransferMessage(null);
      await moveAnimalPaddock(animalId, transferTarget);
      setTransferMessage(`Animal #${animalId} trasladado exitosamente.`);
      loadMetrics(currentPaddockId);
    } catch (err) {
      setError(`Error al trasladar: ${err.message}`);
    }
  };

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
            {potrero.nombre}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Superficie: {potrero.superficieHa} ha | Disponibilidad forrajera:{" "}
            {potrero.biomasaDisponibleKgHa} kg MS/ha
          </p>
        </div>

        {/* Selector de Potrero Activo */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setCurrentPaddockId(1)}
            className={`badge ${currentPaddockId === 1 ? "badge-green" : ""}`}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              border: "1px solid var(--border-color)",
            }}
          >
            Potrero 1 (Bajo)
          </button>
          <button
            onClick={() => setCurrentPaddockId(2)}
            className={`badge ${currentPaddockId === 2 ? "badge-green" : ""}`}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              border: "1px solid var(--border-color)",
            }}
          >
            Potrero 2 (Loma)
          </button>
        </div>
      </div>

      {transferMessage && (
        <div
          className="card"
          style={{
            backgroundColor: "var(--agro-green-soft)",
            color: "var(--agro-green-dark)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle2 size={18} /> {transferMessage}
        </div>
      )}

      {/* Panel de Control de Alertas Sanitarias y de Faena */}
      {alertsData && (
        <div style={{ marginBottom: "1.5rem" }}>
          {alertsData.totalAlerts === 0 ? (
            <div
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                borderLeft: "4px solid var(--agro-green)",
                backgroundColor: "var(--agro-green-soft)",
                padding: "1rem",
              }}
            >
              <CheckCircle size={20} color="var(--agro-green-dark)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--agro-green-dark)",
                  fontWeight: 600,
                }}
              >
                Rodeo en condiciones óptimas: Sin animales en peso de faena
                inmediata ni desvíos críticos de GDPV.
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {alertsData.readyForSale.items.map((item) => (
                <div
                  key={item.animalId}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    borderLeft: "4px solid var(--agro-amber)",
                    backgroundColor: "var(--agro-amber-soft)",
                    padding: "1rem",
                  }}
                >
                  <AlertOctagon size={20} color="var(--agro-amber)" />
                  <div style={{ fontSize: "0.9rem" }}>
                    <strong>Alerta Faena (Caravana {item.rfidTag}):</strong>{" "}
                    {item.currentWeight} kg alcanzados en {item.paddock}.{" "}
                    {item.reason}.
                  </div>
                </div>
              ))}
              {alertsData.lowPerformance.items.map((item) => (
                <div
                  key={item.animalId}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    borderLeft: "4px solid #dc2626",
                    backgroundColor: "#fee2e2",
                    padding: "1rem",
                  }}
                >
                  <TrendingDown size={20} color="#dc2626" />
                  <div style={{ fontSize: "0.9rem", color: "#991b1b" }}>
                    <strong>Bajo Desempeño (Caravana {item.rfidTag}):</strong>{" "}
                    GDPV de {item.gdpvReal} g/día (brecha de {item.gap} g/día).
                    Evaluar sanidad o suplementación.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

      {/* Alerta de Carga / Faena */}
      {rodeo.pesoPromedioKg >= 320 && (
        <div
          className="card"
          style={{
            borderLeft: "4px solid var(--agro-amber)",
            backgroundColor: "var(--agro-amber-soft)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "var(--agro-amber)",
            }}
          >
            <AlertTriangle size={24} />
            <div>
              <strong>
                Alerta Zootécnica: Lote cercano a Peso de Terminación
              </strong>
              <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                El peso vivo medio supera los 320 kg. Programar pesada final en
                manga y verificar período de carencia sanitaria antes de emitir
                DTe.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manejo de Hacienda en el Potrero */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            Hacienda Asignada a la Parcela
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
            }}
          >
            <span>Mudar a:</span>
            <select
              value={transferTarget}
              onChange={(e) => setTransferTarget(Number(e.target.value))}
              style={{
                padding: "0.3rem 0.6rem",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
              }}
            >
              <option value={1}>Potrero 1 (Bajo)</option>
              <option value={2}>Potrero 2 (Loma)</option>
            </select>
          </div>
        </div>

        {rodeo.totalCabezas === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No hay animales asignados a este potrero.
          </p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Caravana RFID</th>
                  <th>Categoría</th>
                  <th>Último Peso</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: "monospace" }}>982000555666777</td>
                  <td>Ternero destetado</td>
                  <td>
                    <strong>{rodeo.pesoPromedioKg} kg</strong>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTransfer(1)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.3rem 0.7rem",
                        fontSize: "0.8rem",
                        backgroundColor: "#fff",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <ArrowRightLeft size={14} /> Mudar a Potrero{" "}
                      {transferTarget}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
