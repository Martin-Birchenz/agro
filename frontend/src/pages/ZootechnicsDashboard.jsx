import { useState } from "react";
import {
  calculatePearsonRation,
  calculateGrazingStrip,
  calculateWaterBalance,
  calculateAntiparasiticDosing,
  calculateBodyCondition,
  calculateBuySellMargin,
} from "../services/zootechnics.service";
import {
  Calculator,
  Wheat,
  Layers,
  Droplets,
  ShieldAlert,
  Activity,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ZootechnicsDashboard() {
  const [activeTab, setActiveTab] = useState("pearson");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({});

  // 1. Estado Pearson (Módulo 02)
  const [pearsonForm, setPearsonForm] = useState({
    targetCmsKgDay: 10,
    forageCpPercent: 7,
    concentrateCpPercent: 20,
    targetCpPercent: 12,
    concentrateDmPercent: 87,
    headCount: 50,
  });

  // 2. Estado Franja Diaria (Módulo 04)
  const [stripForm, setStripForm] = useState({
    availableForageKgHa: 2500,
    grazingEfficiencyPercent: 55,
    totalEv: 60,
    evIntakeKgDay: 10,
    occupationDays: 1,
    headCount: 60,
  });

  // 3. Estado Balance Hídrico (Módulo 09)
  const [waterForm, setWaterForm] = useState({
    cmsKgDay: 9.5,
    categoryFactor: 1.0,
    ambientTempC: 32,
    heatIncrementPercent: 4.0,
    headCount: 100,
    tankCapacityLiters: 15000,
  });

  // 4. Estado Antiparasitarios (Módulo 07)
  const [parasiteForm, setParasiteForm] = useState({
    avgWeightKg: 280,
    dosePer50KgMl: 1.0,
    headCount: 80,
    withdrawalPeriodDays: 35,
    daysSinceApplication: 10,
    daysUntilSale: 40,
  });

  // 5. Estado Margen Invernada (Módulo 16)
  const [buySellForm, setBuySellForm] = useState({
    entryWeightKg: 180,
    exitWeightKg: 340,
    feederPricePerKg: 2.2,
    fatPricePerKg: 1.95,
    addedCostPerKgGained: 1.1,
  });

  const handleRunCalculation = async (e, moduleKey, apiFunc, payload) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFunc(payload);
      setResults((prev) => ({ ...prev, [moduleKey]: res }));
    } catch (err) {
      setError(err.message || "Error al procesar el cálculo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Centro de Modelado Zootécnico & Decisiones
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            margin: "0.25rem 0 0 0",
          }}
        >
          Simuladores matemáticos oficiales basados en la Planilla Ganadera 2026
        </p>
      </div>

      {/* Selector de Calculadoras */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {[
          { id: "pearson", label: "Módulo 02: Ración Pearson", icon: Wheat },
          { id: "strip", label: "Módulo 04: Franja Pastoreo", icon: Layers },
          { id: "water", label: "Módulo 09: Agua & Calor", icon: Droplets },
          {
            id: "parasite",
            label: "Módulo 07: Retiro Sanitario",
            icon: ShieldAlert,
          },
          {
            id: "buysell",
            label: "Módulo 16: Margen Invernada",
            icon: DollarSign,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.9rem",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: isActive
                  ? "var(--agro-green)"
                  : "var(--bg-card)",
                color: isActive ? "#fff" : "var(--text-main)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          className="card"
          style={{
            color: "#ef4444",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* 1. Módulo 02: Ración Pearson */}
      {activeTab === "pearson" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Formulación de Ración (Cuadrado de Pearson)
            </h3>
            <form
              onSubmit={(e) =>
                handleRunCalculation(
                  e,
                  "pearson",
                  calculatePearsonRation,
                  pearsonForm,
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    CMS Objetivo (kg MS/cab/día)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pearsonForm.targetCmsKgDay}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        targetCmsKgDay: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    PB Objetivo Dieta (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pearsonForm.targetCpPercent}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        targetCpPercent: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    PB Forraje Base (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pearsonForm.forageCpPercent}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        forageCpPercent: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    PB Concentrado (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pearsonForm.concentrateCpPercent}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        concentrateCpPercent: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    MS Concentrado (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pearsonForm.concentrateDmPercent}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        concentrateDmPercent: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Cabezas en Lote
                  </label>
                  <input
                    type="number"
                    value={pearsonForm.headCount}
                    onChange={(e) =>
                      setPearsonForm({
                        ...pearsonForm,
                        headCount: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "var(--agro-green)",
                  color: "#fff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Calculando..." : "Formular Ración"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Resultado de la Mezcla
            </h3>
            {results.pearson ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Concentrado Tal Cual (TC / cabeza):
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    {results.pearson.concentrateTcKgDay} kg/cab/día
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Forraje Base Requerido (MS / cabeza):
                  </span>
                  <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                    {results.pearson.forageMsKgDay} kg MS/cab/día
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Suministro Diario para el Rodeo Completo:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--agro-blue)",
                    }}
                  >
                    {results.pearson.concentrateBatchTcKgDay} kg TC/día
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Completá los parámetros y presioná formular para balancear
                proteína.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. Módulo 04: Franja Pastoreo */}
      {activeTab === "strip" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Cálculo de Franja de Pastoreo Rotativo
            </h3>
            <form
              onSubmit={(e) =>
                handleRunCalculation(
                  e,
                  "strip",
                  calculateGrazingStrip,
                  stripForm,
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Disponibilidad (kg MS/ha)
                  </label>
                  <input
                    type="number"
                    value={stripForm.availableForageKgHa}
                    onChange={(e) =>
                      setStripForm({
                        ...stripForm,
                        availableForageKgHa: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Eficiencia Cosecha (%)
                  </label>
                  <input
                    type="number"
                    value={stripForm.grazingEfficiencyPercent}
                    onChange={(e) =>
                      setStripForm({
                        ...stripForm,
                        grazingEfficiencyPercent: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    EV Totales del Rodeo
                  </label>
                  <input
                    type="number"
                    value={stripForm.totalEv}
                    onChange={(e) =>
                      setStripForm({
                        ...stripForm,
                        totalEv: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Días Ocupación Parcela
                  </label>
                  <input
                    type="number"
                    value={stripForm.occupationDays}
                    onChange={(e) =>
                      setStripForm({
                        ...stripForm,
                        occupationDays: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "var(--agro-green)",
                  color: "#fff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {loading
                  ? "Dimensionando..."
                  : "Calcular Superficie de Parcela"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Dimensionamiento de Franja
            </h3>
            {results.strip ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Superficie Asignada:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    {results.strip.stripSurfaceHa} ha (
                    {results.strip.stripSurfaceM2} m²)
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Forraje Aprovechable:
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    {results.strip.usableForageKgHa} kg MS/ha
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Asignación Diaria por Cabeza:
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    {results.strip.allowancePerHeadKgDay} kg MS/cab/día
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Indicá disponibilidad forrajera y carga para calcular la parcela
                diaria.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Módulo 09: Agua y Calor */}
      {activeTab === "water" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Balance Hídrico & Demanda por Calor
            </h3>
            <form
              onSubmit={(e) =>
                handleRunCalculation(
                  e,
                  "water",
                  calculateWaterBalance,
                  waterForm,
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Temperatura Ambiente (°C)
                  </label>
                  <input
                    type="number"
                    value={waterForm.ambientTempC}
                    onChange={(e) =>
                      setWaterForm({
                        ...waterForm,
                        ambientTempC: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    CMS Diario (kg MS)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterForm.cmsKgDay}
                    onChange={(e) =>
                      setWaterForm({
                        ...waterForm,
                        cmsKgDay: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Cabezas en Potrero
                  </label>
                  <input
                    type="number"
                    value={waterForm.headCount}
                    onChange={(e) =>
                      setWaterForm({
                        ...waterForm,
                        headCount: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Capacidad Bebedero / Tanque (L)
                  </label>
                  <input
                    type="number"
                    value={waterForm.tankCapacityLiters}
                    onChange={(e) =>
                      setWaterForm({
                        ...waterForm,
                        tankCapacityLiters: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "var(--agro-green)",
                  color: "#fff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Simulando..." : "Calcular Consumo Hídrico"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Demanda de Agua & Autonomía
            </h3>
            {results.water ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Consumo Total Rodeo:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--agro-blue)",
                    }}
                  >
                    {results.water.batchWaterTotalLDay} Litros/día
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Consumo por Animal:
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    {results.water.totalWaterPerHeadLDay} L/cab/día (Base:{" "}
                    {results.water.baseWaterPerHeadLDay} L + Calor:{" "}
                    {results.water.heatStressWaterLDay} L)
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Autonomía de Aguada:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color:
                        results.water.tankAutonomyDays < 2
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {results.water.tankAutonomyDays
                      ? `${results.water.tankAutonomyDays} días de reserva`
                      : "Sin capacidad configurada"}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Ingresá temperatura y tamaño de rodeo para estimar el estrés
                calórico.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 4. Módulo 07: Retiro Sanitario */}
      {activeTab === "parasite" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Dosificación & Período de Retiro
            </h3>
            <form
              onSubmit={(e) =>
                handleRunCalculation(
                  e,
                  "parasite",
                  calculateAntiparasiticDosing,
                  parasiteForm,
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Peso Promedio (kg)
                  </label>
                  <input
                    type="number"
                    value={parasiteForm.avgWeightKg}
                    onChange={(e) =>
                      setParasiteForm({
                        ...parasiteForm,
                        avgWeightKg: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Dosis cada 50 kg (mL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={parasiteForm.dosePer50KgMl}
                    onChange={(e) =>
                      setParasiteForm({
                        ...parasiteForm,
                        dosePer50KgMl: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Período Carencia (días)
                  </label>
                  <input
                    type="number"
                    value={parasiteForm.withdrawalPeriodDays}
                    onChange={(e) =>
                      setParasiteForm({
                        ...parasiteForm,
                        withdrawalPeriodDays: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Días Desde Aplicación
                  </label>
                  <input
                    type="number"
                    value={parasiteForm.daysSinceApplication}
                    onChange={(e) =>
                      setParasiteForm({
                        ...parasiteForm,
                        daysSinceApplication: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "var(--agro-green)",
                  color: "#fff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Verificando..." : "Auditar Carencia y Dosis"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Aptitud para Faena / Venta
            </h3>
            {results.parasite ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Estado de Venta:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: results.parasite.canBeMarketed
                        ? "#10b981"
                        : "#ef4444",
                    }}
                  >
                    {results.parasite.canBeMarketed
                      ? "APTO PARA FAENA / VENTA"
                      : `EN CARENCIA (${results.parasite.remainingWithdrawalDays} días restantes)`}
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Dosis Recomendada:
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    {results.parasite.dosePerHeadMl} mL / cabeza
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Cargá los días de retiro del prospecto veterinario para auditar
                despacho.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 5. Módulo 16: Margen Invernada */}
      {activeTab === "buysell" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Relación Compra-Venta e Invernada
            </h3>
            <form
              onSubmit={(e) =>
                handleRunCalculation(
                  e,
                  "buysell",
                  calculateBuySellMargin,
                  buySellForm,
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Peso Compra Ternero (kg)
                  </label>
                  <input
                    type="number"
                    value={buySellForm.entryWeightKg}
                    onChange={(e) =>
                      setBuySellForm({
                        ...buySellForm,
                        entryWeightKg: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Peso Venta Gordo (kg)
                  </label>
                  <input
                    type="number"
                    value={buySellForm.exitWeightKg}
                    onChange={(e) =>
                      setBuySellForm({
                        ...buySellForm,
                        exitWeightKg: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Precio Ternero ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={buySellForm.feederPricePerKg}
                    onChange={(e) =>
                      setBuySellForm({
                        ...buySellForm,
                        feederPricePerKg: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
                <div>
                  <label
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Precio Gordo ($/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={buySellForm.fatPricePerKg}
                    onChange={(e) =>
                      setBuySellForm({
                        ...buySellForm,
                        fatPricePerKg: parseFloat(e.target.value),
                      })
                    }
                    style={{ width: "100%", padding: "0.4rem" }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  Costo Agregado por kg Ganado ($/kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={buySellForm.addedCostPerKgGained}
                  onChange={(e) =>
                    setBuySellForm({
                      ...buySellForm,
                      addedCostPerKgGained: parseFloat(e.target.value),
                    })
                  }
                  style={{ width: "100%", padding: "0.4rem" }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "var(--agro-green)",
                  color: "#fff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Calculando..." : "Calcular Margen de Invernada"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Márgenes Económicos de Invernada
            </h3>
            {results.buysell ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Margen Bruto por Cabeza:
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color:
                        results.buysell.grossMarginPerHead >= 0
                          ? "#10b981"
                          : "#ef4444",
                    }}
                  >
                    ${results.buysell.grossMarginPerHead} / cabeza
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Relación Compra / Venta (Flaco / Gordo):
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    {results.buysell.buySellRatio}
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.75rem",
                    background: "var(--bg-main)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Costo de Equilibrio por kg Producido:
                  </span>
                  <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
                    ${results.buysell.breakEvenCostPerKgGained} / kg
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Simulá la relación ternero/gordo para evaluar viabilidad
                económica.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
