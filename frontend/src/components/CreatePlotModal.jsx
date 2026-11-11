import { useState } from "react";
import { createPlot, createCampaign } from "../services/agriculture.service";
import { Layers, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function CreatePlotModal({
  isOpen,
  onClose,
  farmId,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [surfaceHa, setSurfaceHa] = useState("");
  const [soilType, setSoilType] = useState("Argiudol Típico");
  const [cropType, setCropType] = useState("SOJA_1RA");
  const [seasonYear, setSeasonYear] = useState("2026/2027");
  const [targetYield, setTargetYield] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Crear el lote físico
      const plot = await createPlot({
        farmId,
        name: name.trim(),
        surfaceHa: parseFloat(surfaceHa),
        soilType: soilType.trim() || null,
      });

      // 2. Asociarle la campaña productiva inicial
      await createCampaign({
        plotId: plot.id,
        cropType,
        seasonYear,
        status: "PLANIFICADO",
        targetYieldTnHa: targetYield ? parseFloat(targetYield) : null,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Error al registrar el nuevo lote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        className="card"
        style={{ width: "90%", maxWidth: "520px", position: "relative" }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
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
            marginBottom: "1.2rem",
          }}
        >
          <Layers size={22} color="#10b981" />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            Delimitar Nuevo Lote Agrícola
          </h2>
        </div>

        {error && (
          <div
            style={{
              padding: "0.6rem",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              borderRadius: "6px",
              marginBottom: "1rem",
              display: "flex",
              gap: "0.4rem",
              fontSize: "0.85rem",
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
        >
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Nombre / Identificación del Lote
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Lote 3 - El Ombú Norte"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Superficie Neta (ha)
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="Ej: 95.5"
                value={surfaceHa}
                onChange={(e) => setSurfaceHa(e.target.value)}
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
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Serie de Suelo
              </label>
              <input
                type="text"
                placeholder="Ej: Argiudol / Vertisol"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  marginTop: "0.25rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-main)",
              padding: "0.75rem",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Campaña y Destino Inicial
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div>
                <label
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  Cultivo
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.2rem",
                  }}
                >
                  <option value="SOJA_1RA">Soja de 1ra</option>
                  <option value="SOJA_2DA">Soja de 2da</option>
                  <option value="MAIZ">Maíz Tardío/Temprano</option>
                  <option value="TRIGO">Trigo</option>
                  <option value="GIRASOL">Girasol</option>
                  <option value="SORGO">Sorgo Granífero</option>
                </select>
              </div>
              <div>
                <label
                  style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                >
                  Rinde Objetivo (tn/ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 3.5"
                  value={targetYield}
                  onChange={(e) => setTargetYield(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-color)",
                    marginTop: "0.2rem",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "0.7rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading
              ? "Creando lote y asignando campaña..."
              : "Guardar Lote y Activar"}
          </button>
        </form>
      </div>
    </div>
  );
}
