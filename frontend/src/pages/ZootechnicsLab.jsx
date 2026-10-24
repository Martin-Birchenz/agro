import { useState } from "react";
import {
  calculatePearsonRation,
  calculateFeedConversion,
  calculateWaterBalance,
  calculateBuySellMargin,
} from "../services/zootechnics.service";

export default function ZootechnicsLab() {
  const [activeTab, setActiveTab] = useState("pearson");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Estados de formularios
  const [pearsonForm, setPearsonForm] = useState({
    totalCmsKg: 10.0,
    foragePbPercent: 8.0,
    concentratePbPercent: 38.0,
    targetPbPercent: 14.0,
    concentrateDmPercent: 90.0,
    headCount: 80,
  });

  const [waterForm, setWaterForm] = useState({
    cmsKgDay: 10.0,
    categoryFactor: 1.0,
    ambientTempC: 35.0,
    heatIncrementPercent: 4.0,
    headCount: 100,
    tankCapacityLiters: 25000,
    baseWaterLPerKgMs: 4.0,
  });

  const [marginForm, setMarginForm] = useState({
    entryWeightKg: 180,
    exitWeightKg: 340,
    feederPricePerKg: 2200,
    fatPricePerKg: 2000,
    addedCostPerKgGained: 1200,
  });

  const handleRunPearson = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculatePearsonRation({
        totalCmsKg: Number(pearsonForm.totalCmsKg),
        foragePbPercent: Number(pearsonForm.foragePbPercent),
        concentratePbPercent: Number(pearsonForm.concentratePbPercent),
        targetPbPercent: Number(pearsonForm.targetPbPercent),
        concentrateDmPercent: Number(pearsonForm.concentrateDmPercent),
        headCount: Number(pearsonForm.headCount),
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunWater = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculateWaterBalance({
        cmsKgDay: Number(waterForm.cmsKgDay),
        categoryFactor: Number(waterForm.categoryFactor),
        ambientTempC: Number(waterForm.ambientTempC),
        heatIncrementPercent: Number(waterForm.heatIncrementPercent),
        headCount: Number(waterForm.headCount),
        tankCapacityLiters: Number(waterForm.tankCapacityLiters),
        baseWaterLPerKgMs: Number(waterForm.baseWaterLPerKgMs),
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMargin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculateBuySellMargin({
        entryWeightKg: Number(marginForm.entryWeightKg),
        exitWeightKg: Number(marginForm.exitWeightKg),
        feederPricePerKg: Number(marginForm.feederPricePerKg),
        fatPricePerKg: Number(marginForm.fatPricePerKg),
        addedCostPerKgGained: Number(marginForm.addedCostPerKgGained),
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Simulador Zootécnico & Financiero
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Ejecución en tiempo real de los módulos de la Planilla Ganadera 2026
        </p>
      </div>

      {/* Selector de Módulo */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => {
            setActiveTab("pearson");
            setResult(null);
          }}
          className={`badge ${activeTab === "pearson" ? "badge-green" : ""}`}
          style={{
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            padding: "0.5rem 1rem",
          }}
        >
          Módulo 02: Pearson (PB)
        </button>
        <button
          onClick={() => {
            setActiveTab("water");
            setResult(null);
          }}
          className={`badge ${activeTab === "water" ? "badge-blue" : ""}`}
          style={{
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            padding: "0.5rem 1rem",
          }}
        >
          Módulo 09: Balance Hídrico
        </button>
        <button
          onClick={() => {
            setActiveTab("margin");
            setResult(null);
          }}
          className={`badge ${activeTab === "margin" ? "badge-green" : ""}`}
          style={{
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            padding: "0.5rem 1rem",
          }}
        >
          Módulo 16: Margen Invernada
        </button>
      </div>

      {/* Formulario según pestaña */}
      <div className="card">
        {activeTab === "pearson" && (
          <form onSubmit={handleRunPearson}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Ración Binaria - Cuadrado de Pearson
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className="metric-label">CMS Total (kg MS)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={pearsonForm.totalCmsKg}
                  onChange={(e) =>
                    setPearsonForm({
                      ...pearsonForm,
                      totalCmsKg: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">% PB Forraje Base</label>
                <input
                  type="number"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={pearsonForm.foragePbPercent}
                  onChange={(e) =>
                    setPearsonForm({
                      ...pearsonForm,
                      foragePbPercent: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">% PB Concentrado</label>
                <input
                  type="number"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={pearsonForm.concentratePbPercent}
                  onChange={(e) =>
                    setPearsonForm({
                      ...pearsonForm,
                      concentratePbPercent: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">% PB Objetivo</label>
                <input
                  type="number"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={pearsonForm.targetPbPercent}
                  onChange={(e) =>
                    setPearsonForm({
                      ...pearsonForm,
                      targetPbPercent: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "var(--agro-green)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Calculando..." : "Calcular Ración"}
            </button>
          </form>
        )}

        {activeTab === "water" && (
          <form onSubmit={handleRunWater}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Demanda de Agua y Estrés Térmico
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className="metric-label">CMS Diario (kg MS/cab)</label>
                <input
                  type="number"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={waterForm.cmsKgDay}
                  onChange={(e) =>
                    setWaterForm({ ...waterForm, cmsKgDay: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="metric-label">
                  Temperatura Ambiente (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={waterForm.ambientTempC}
                  onChange={(e) =>
                    setWaterForm({ ...waterForm, ambientTempC: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="metric-label">Cabezas del Lote</label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={waterForm.headCount}
                  onChange={(e) =>
                    setWaterForm({ ...waterForm, headCount: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="metric-label">
                  Capacidad Tanque (Litros)
                </label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={waterForm.tankCapacityLiters}
                  onChange={(e) =>
                    setWaterForm({
                      ...waterForm,
                      tankCapacityLiters: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "var(--agro-blue)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Calculando..." : "Calcular Balance Hídrico"}
            </button>
          </form>
        )}

        {activeTab === "margin" && (
          <form onSubmit={handleRunMargin}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Relación Compra-Venta y Margen de Invernada
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label className="metric-label">Peso Entrada (kg)</label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={marginForm.entryWeightKg}
                  onChange={(e) =>
                    setMarginForm({
                      ...marginForm,
                      entryWeightKg: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">Peso Salida (kg)</label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={marginForm.exitWeightKg}
                  onChange={(e) =>
                    setMarginForm({
                      ...marginForm,
                      exitWeightKg: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">$/kg Compra (Ternero)</label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={marginForm.feederPricePerKg}
                  onChange={(e) =>
                    setMarginForm({
                      ...marginForm,
                      feederPricePerKg: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="metric-label">$/kg Venta (Gordo)</label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                  value={marginForm.fatPricePerKg}
                  onChange={(e) =>
                    setMarginForm({
                      ...marginForm,
                      fatPricePerKg: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.5rem",
                backgroundColor: "var(--agro-green)",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? "Calculando..." : "Calcular Margen"}
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="card" style={{ color: "#dc2626" }}>
          Error: {error}
        </div>
      )}

      {/* Resultados Dinámicos */}
      {result && (
        <div
          className="card"
          style={{ borderLeft: "4px solid var(--agro-green)" }}
        >
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Resultados Obtenidos
          </h3>
          <div className="grid-metrics">
            {Object.entries(result).map(([key, val]) => (
              <div key={key} className="metric-card">
                <div className="metric-label">{key}</div>
                <div className="metric-value">
                  {typeof val === "number"
                    ? val.toLocaleString("es-AR")
                    : String(val)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
