import { useState, useEffect } from "react";
import {
  getPaddocksList,
  getPaddockMetrics,
  createPaddock,
  moveAnimalPaddock,
} from "../services/paddock.service";
import { getZootechnicalAlerts } from "../services/alert.service";
import {
  Compass,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";

export default function PaddockManager() {
  const [paddocks, setPaddocks] = useState([]);
  const [currentPaddockId, setCurrentPaddockId] = useState(1);
  const [data, setData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferTarget, setTransferTarget] = useState(2);
  const [transferMessage, setTransferMessage] = useState(null);

  // Estado para el modal de nuevo potrero
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [newPaddock, setNewPaddock] = useState({
    name: "",
    surfaceHa: "",
    availableForageKgHa: 3500,
    grazingEfficiencyPercent: 55,
  });

  // Cargar lista de potreros inicial
  const loadPaddocks = async () => {
    try {
      const list = await getPaddocksList();
      setPaddocks(list || []);
      if (list && list.length > 0 && !currentPaddockId) {
        setCurrentPaddockId(list[0].id);
      }
    } catch (err) {
      console.error("Error al cargar potreros:", err);
    }
  };

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
    loadPaddocks();
  }, []);

  useEffect(() => {
    if (currentPaddockId) {
      loadMetrics(currentPaddockId);
    }
    getZootechnicalAlerts()
      .then((res) => setAlertsData(res))
      .catch((err) => console.error("Error al obtener alertas:", err));
  }, [currentPaddockId]);

  const handleTransfer = async (animalId) => {
    try {
      setTransferMessage(null);
      await moveAnimalPaddock(animalId, transferTarget);
      setTransferMessage(`Animal #${animalId} trasladado con éxito.`);
      loadMetrics(currentPaddockId);
    } catch (err) {
      setError(`Error al trasladar animal: ${err.message}`);
    }
  };

  const handleCreatePaddock = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await createPaddock({
        fieldId: 1,
        name: newPaddock.name,
        surfaceHa: Number(newPaddock.surfaceHa),
        availableForageKgHa: Number(newPaddock.availableForageKgHa),
        grazingEfficiencyPercent: Number(newPaddock.grazingEfficiencyPercent),
      });
      setShowModal(false);
      setNewPaddock({
        name: "",
        surfaceHa: "",
        availableForageKgHa: 3500,
        grazingEfficiencyPercent: 55,
      });
      await loadPaddocks();
    } catch (err) {
      alert(`Error al crear potrero: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      {/* Cabecera y acciones */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Monitoreo de Potreros y Pastoreo
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Control de carga instantánea y dimensionamiento de franjas
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Selector dinámico de potreros */}
          {paddocks.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentPaddockId(p.id)}
              className={`badge ${currentPaddockId === p.id ? "badge-green" : ""}`}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                border: "1px solid var(--border-color)",
              }}
            >
              {p.name}
            </button>
          ))}

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              backgroundColor: "var(--agro-green)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 0.9rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <Plus size={16} /> Nuevo Potrero
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

      {/* Alertas Tempranas */}
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
              <CheckCircle2 size={20} color="var(--agro-green-dark)" />
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--agro-green-dark)",
                  fontWeight: 600,
                }}
              >
                Rodeo en condiciones óptimas: Sin animales en peso de faena
                inmediata ni desvíos de GDPV.
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
                  <AlertTriangle size={20} color="var(--agro-amber)" />
                  <div style={{ fontSize: "0.9rem" }}>
                    <strong>Alerta Faena (Caravana {item.rfidTag}):</strong>{" "}
                    {item.currentWeight} kg alcanzados en {item.paddock}.{" "}
                    {item.reason}.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && <div className="card">Cargando métricas de pastoreo...</div>}
      {error && (
        <div className="card" style={{ color: "#dc2626" }}>
          Error: {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div className="grid-metrics">
            <div className="metric-card">
              <div className="metric-label">Cabezas y Peso Vivo</div>
              <div className="metric-value">{data.rodeo.totalCabezas} cab</div>
              <div className="metric-sub">
                Promedio: {data.rodeo.pesoPromedioKg} kg
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Carga Animal Instantánea</div>
              <div className="metric-value">
                {data.rodeo.cargaActualEvHa} EV/ha
              </div>
              <div className="metric-sub">
                Total: {data.rodeo.evTotal} Equivalencias Vaca
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Demanda de Materia Seca</div>
              <div className="metric-value">
                {data.demandaAlimenticia?.cmsLoteKgDia ?? 0} kg/día
              </div>
              <div className="metric-sub">
                Reserva 90d: {data.demandaAlimenticia?.reserva90DiasTnMs ?? 0}{" "}
                tn MS
              </div>
            </div>

            <div
              className="metric-card"
              style={{ borderLeft: "4px solid var(--agro-green)" }}
            >
              <div className="metric-label">
                Boyero Eléctrico (Franja Diaria)
              </div>
              <div
                className="metric-value"
                style={{ color: "var(--agro-green)" }}
              >
                {data.pastoreoRotativo?.superficieFranjaDiariaM2 ?? 0} m²
              </div>
              <div className="metric-sub">
                Equivalente a{" "}
                {data.pastoreoRotativo?.superficieFranjaDiariaHa ?? 0} ha/día
              </div>
            </div>
          </div>

          {/* Tabla de Hacienda y Reasignación */}
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
                Hacienda Asignada a {data.potrero.nombre}
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
                  {paddocks
                    .filter((p) => p.id !== currentPaddockId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {data.rodeo.totalCabezas === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                No hay animales asignados a este potrero actualmente.
              </p>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Identificador</th>
                      <th>Peso Promedio Lote</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontFamily: "monospace" }}>
                        Lote Activo Potrero #{data.potrero.id}
                      </td>
                      <td>
                        <strong>{data.rodeo.pesoPromedioKg} kg</strong>
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
                          <ArrowRightLeft size={14} /> Mudar a seleccionado
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal para Crear Potrero */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                Nuevo Potrero
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreatePaddock}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label className="metric-label">Nombre del Potrero</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Potrero 3 - Pastura Consociada"
                  value={newPaddock.name}
                  onChange={(e) =>
                    setNewPaddock({ ...newPaddock, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div>
                <label className="metric-label">Superficie Total (ha)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ej: 30"
                  value={newPaddock.surfaceHa}
                  onChange={(e) =>
                    setNewPaddock({ ...newPaddock, surfaceHa: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div>
                <label className="metric-label">
                  Biomasa Disponible (kg MS/ha)
                </label>
                <input
                  type="number"
                  required
                  value={newPaddock.availableForageKgHa}
                  onChange={(e) =>
                    setNewPaddock({
                      ...newPaddock,
                      availableForageKgHa: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div>
                <label className="metric-label">% Eficiencia de Pastoreo</label>
                <input
                  type="number"
                  max="100"
                  min="1"
                  required
                  value={newPaddock.grazingEfficiencyPercent}
                  onChange={(e) =>
                    setNewPaddock({
                      ...newPaddock,
                      grazingEfficiencyPercent: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.25rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid var(--border-color)",
                    background: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--agro-green)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {modalLoading ? "Guardando..." : "Crear Potrero"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
