import { useState, useEffect } from "react";
import { useFarm } from "../context/FarmContext";
import { getFarmPlots, getGrossMargins } from "../services/agriculture.service";
import RegisterLaborModal from "../components/RegisterLaborModal";
import CreatePlotModal from "../components/CreatePlotModal";
import {
  Layers,
  RefreshCw,
  AlertCircle,
  Wrench,
  Plus,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function AgricultureManager() {
  const { activeFarm } = useFarm();
  const [plots, setPlots] = useState([]);
  const [margins, setMargins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPlotForLabor, setSelectedPlotForLabor] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    if (!activeFarm?.id) return;
    try {
      setLoading(true);
      setError(null);
      const [plotsData, marginData] = await Promise.all([
        getFarmPlots(activeFarm.id),
        getGrossMargins(activeFarm.id).catch(() => []),
      ]);
      setPlots(plotsData || []);
      setMargins(marginData || []);
    } catch (err) {
      setError(err.message || "Error al cargar datos agrícolas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFarm?.id]);

  const totalHa = plots.reduce((acc, p) => acc + Number(p.surface_ha), 0);
  const totalMarginUsd = margins.reduce(
    (acc, m) => acc + Number(m.totalGrossMarginUsd || 0),
    0,
  );

  return (
    <div>
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Lotes y Campañas Agrícolas
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              margin: "0.25rem 0 0 0",
            }}
          >
            Supervisión agronómica, rinde esperado y margen bruto en{" "}
            {activeFarm?.name || "el campo"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "var(--agro-green)",
              border: "none",
              color: "#fff",
              padding: "0.5rem 0.9rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <Plus size={16} /> Delimitar Nuevo Lote
          </button>
          <button
            onClick={fetchData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)",
              padding: "0.5rem 0.8rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>
      </div>

      {/* Métricas rápidas: Superficie y Margen Bruto */}
      <div className="grid-metrics" style={{ marginBottom: "1.5rem" }}>
        <div className="metric-card">
          <div className="metric-label">Lotes Delimitados</div>
          <div className="metric-value">{plots.length}</div>
          <div className="metric-sub">Parcelas bajo agricultura</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Superficie Agrícola Total</div>
          <div className="metric-value" style={{ color: "#10b981" }}>
            {totalHa.toFixed(1)} ha
          </div>
          <div className="metric-sub">Hectáreas netas productivas</div>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #10b981" }}
        >
          <div className="metric-label">Margen Bruto Proyectado</div>
          <div className="metric-value" style={{ color: "#10b981" }}>
            $
            {totalMarginUsd.toLocaleString("es-AR", {
              maximumFractionDigits: 0,
            })}{" "}
            USD
          </div>
          <div className="metric-sub">
            Ingresos estimados - Insumos y Labores
          </div>
        </div>
      </div>

      {loading && <div className="card">Cargando módulos agrícolas...</div>}
      {error && (
        <div
          className="card"
          style={{
            color: "#dc2626",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Grilla de Lotes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {plots.map((plot) => {
          const marginInfo = margins.find((m) => m.plot_id === plot.plot_id);

          return (
            <div
              key={plot.plot_id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3
                      style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}
                    >
                      {plot.plot_name}
                    </h3>
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Suelo: {plot.soil_type || "No clasificado"}
                    </span>
                  </div>
                  <span
                    className="badge badge-green"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {plot.surface_ha} ha
                  </span>
                </div>

                <hr
                  style={{
                    border: "0",
                    borderTop: "1px solid var(--border-color)",
                    margin: "0.5rem 0",
                  }}
                />

                {plot.crop_type ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>
                        Campaña:
                      </span>
                      <strong>{plot.season_year}</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>
                        Cultivo:
                      </span>
                      <span style={{ color: "#10b981", fontWeight: 600 }}>
                        {plot.crop_type}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>
                        Estado:
                      </span>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "rgba(59, 130, 246, 0.2)",
                          color: "#60a5fa",
                        }}
                      >
                        {plot.campaign_status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>
                        Rinde Objetivo:
                      </span>
                      <span>
                        {plot.target_yield_tn_ha
                          ? `${plot.target_yield_tn_ha} tn/ha`
                          : "S/D"}
                      </span>
                    </div>

                    {marginInfo && (
                      <div
                        style={{
                          marginTop: "0.4rem",
                          padding: "0.5rem",
                          backgroundColor: "var(--bg-main)",
                          borderRadius: "6px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.8rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            Costo Insumos/Labores:
                          </span>
                          <span>${marginInfo.costPerHa} /ha</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            marginTop: "0.2rem",
                          }}
                        >
                          <span style={{ color: "var(--text-muted)" }}>
                            Margen Est. (MB/ha):
                          </span>
                          <span
                            style={{
                              color:
                                marginInfo.grossMarginHa >= 0
                                  ? "#10b981"
                                  : "#ef4444",
                            }}
                          >
                            ${marginInfo.grossMarginHa} USD/ha
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      margin: 0,
                    }}
                  >
                    Sin campaña activa asignada para este ciclo.
                  </p>
                )}
              </div>

              {plot.campaign_id && (
                <button
                  onClick={() => setSelectedPlotForLabor(plot)}
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    backgroundColor: "var(--bg-main)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-main)",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  <Wrench size={15} color="#10b981" /> Registrar Labor / Insumo
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Labor Agrícola */}
      <RegisterLaborModal
        isOpen={Boolean(selectedPlotForLabor)}
        onClose={() => setSelectedPlotForLabor(null)}
        plot={selectedPlotForLabor}
        farmId={activeFarm?.id}
        onSuccess={fetchData}
      />

      {/* Modal para Crear Lote y Campaña */}
      <CreatePlotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        farmId={activeFarm?.id}
        onSuccess={fetchData}
      />
    </div>
  );
}
