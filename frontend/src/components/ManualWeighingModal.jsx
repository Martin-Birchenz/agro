import { useState } from "react";
import { registerManualWeighing } from "../services/weighing.service";
import { Scale, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function ManualWeighingModal({ isOpen, onClose, onSuccess }) {
  const [rfidTag, setRfidTag] = useState("982000555666777");
  const [weightKg, setWeightKg] = useState("");
  const [targetWeightKg, setTargetWeightKg] = useState("340");
  const [weighedAt, setWeighedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await registerManualWeighing({
        rfidTag: rfidTag.trim(),
        weightKg: parseFloat(weightKg),
        targetWeightKg: parseFloat(targetWeightKg) || 340,
        weighedAt: new Date(weighedAt).toISOString(),
      });

      setResult(response);
      if (onSuccess) onSuccess(response);
    } catch (err) {
      setError(err.message || "Error al procesar el pesaje manual");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--bg-card)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Scale size={22} color="#10b981" />
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>
            Nuevo Pesaje Manual
          </h2>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={18} />
              <span>Pesaje registrado con éxito</span>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-main)",
                padding: "1rem",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                fontSize: "0.85rem",
              }}
            >
              <div>
                <span style={{ color: "var(--text-muted)" }}>Peso Actual:</span>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>
                  {result.currentWeightKg} kg
                </p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>
                  Ganancia Neta:
                </span>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: result.weightGainKg >= 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {result.weightGainKg !== null
                    ? `${result.weightGainKg > 0 ? "+" : ""}${result.weightGainKg} kg`
                    : "Primer pesaje"}
                </p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>GDPV Real:</span>
                <p style={{ margin: 0, fontWeight: 700, color: "#60a5fa" }}>
                  {result.gdpvRealKgDay !== null
                    ? `${result.gdpvRealKgDay} kg/día`
                    : "S/D"}
                </p>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>
                  Días a Objetivo:
                </span>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {result.daysToTarget !== null
                    ? `${result.daysToTarget} días`
                    : "Meta alcanzada"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setWeightKg("");
              }}
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              Cargar otro pesaje
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
              >
                Caravana RFID (15 dígitos):
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={rfidTag}
                onChange={(e) => setRfidTag(e.target.value)}
                placeholder="Ej: 982000555666777"
                style={{ width: "100%", marginTop: "0.25rem" }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              <div>
                <label
                  style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                >
                  Peso Actual (kg):
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="input-field"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="Ej: 395.5"
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label
                  style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                >
                  Meta Venta (kg):
                </label>
                <input
                  type="number"
                  step="1"
                  className="input-field"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  placeholder="340"
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
            </div>

            <div>
              <label
                style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
              >
                Fecha y Hora de Pesada:
              </label>
              <input
                type="datetime-local"
                required
                className="input-field"
                value={weighedAt}
                onChange={(e) => setWeighedAt(e.target.value)}
                style={{ width: "100%", marginTop: "0.25rem" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                backgroundColor: "#10b981",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Calculando métricas..." : "Registrar y Calcular GDPV"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
