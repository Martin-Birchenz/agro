import { useState, useEffect } from "react";
import { getFarmStock } from "../services/stock.service";
import { registerLabor } from "../services/agriculture.service";
import { Wrench, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function RegisterLaborModal({
  isOpen,
  onClose,
  plot,
  farmId,
  onSuccess,
}) {
  const [laborType, setLaborType] = useState("PULVERIZACION");
  const [contractor, setContractor] = useState("");
  const [surfaceHa, setSurfaceHa] = useState(plot?.surface_ha || "");
  const [stockItems, setStockItems] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState("");
  const [dosePerHa, setDosePerHa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && farmId) {
      getFarmStock(farmId)
        .then((items) => {
          setStockItems(items || []);
          if (items && items.length > 0) setSelectedStockId(items[0].id);
        })
        .catch((err) => setError(err.message));
    }
  }, [isOpen, farmId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        campaignId: plot.campaign_id,
        laborType,
        appliedSurfaceHa: parseFloat(surfaceHa),
        contractorName: contractor || null,
        laborCostUsdHa: 0,
        supplies:
          selectedStockId && dosePerHa
            ? [
                {
                  stockItemId: parseInt(selectedStockId),
                  dosePerHa: parseFloat(dosePerHa),
                },
              ]
            : [],
      };

      await registerLabor(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setError(err.message || "Error al registrar la labor");
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = stockItems.find(
    (s) => s.id === parseInt(selectedStockId),
  );
  const totalDose = (parseFloat(dosePerHa) || 0) * (parseFloat(surfaceHa) || 0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        className="card"
        style={{ width: "90%", maxWidth: "500px", position: "relative" }}
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
            marginBottom: "1rem",
          }}
        >
          <Wrench size={20} color="#10b981" />
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>
            Registrar Labor — {plot?.plot_name}
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

        {success && (
          <div
            style={{
              padding: "0.6rem",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              borderRadius: "6px",
              marginBottom: "1rem",
              display: "flex",
              gap: "0.4rem",
              fontSize: "0.85rem",
            }}
          >
            <CheckCircle2 size={16} /> Labor guardada y stock descontado
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Tipo de Labor
              </label>
              <select
                value={laborType}
                onChange={(e) => setLaborType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <option value="BARBECHO">Barbecho Químico</option>
                <option value="PULVERIZACION">
                  Pulverización / Fitosanitario
                </option>
                <option value="SIEMBRA">Siembra</option>
                <option value="FERTILIZACION">Fertilización</option>
                <option value="COSECHA">Cosecha</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Superficie Aplicada (ha)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={surfaceHa}
                onChange={(e) => setSurfaceHa(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Contratista / Operario
            </label>
            <input
              type="text"
              placeholder="Ej: Don Pedro Pulverizaciones"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div
            style={{
              background: "var(--bg-main)",
              padding: "0.75rem",
              borderRadius: "6px",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Descuento de Insumo del Galpón
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr",
                gap: "0.5rem",
              }}
            >
              <select
                value={selectedStockId}
                onChange={(e) => setSelectedStockId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.45rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.85rem",
                }}
              >
                {stockItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.current_quantity} {item.unit_of_measure})
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Dosis/ha"
                value={dosePerHa}
                onChange={(e) => setDosePerHa(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.45rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                  fontSize: "0.85rem",
                }}
              />
            </div>
            {selectedItem && dosePerHa && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#10b981",
                  marginTop: "0.3rem",
                  display: "block",
                }}
              >
                Descuento total proyectado:{" "}
                <strong>
                  {totalDose.toFixed(2)} {selectedItem.unit_of_measure}
                </strong>
              </span>
            )}
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
            }}
          >
            {loading
              ? "Procesando labor..."
              : "Registrar Labor y Descontar Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}
