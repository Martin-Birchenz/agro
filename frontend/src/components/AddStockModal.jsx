import { useState } from "react";
import { useFarm } from "../context/FarmContext";
import { createStockItem } from "../services/stock.service";
import { X, PackagePlus, AlertCircle } from "lucide-react";

const CATEGORIES = [
  "SEMILLA",
  "FERTILIZANTE",
  "FITOSANITARIO",
  "VETERINARIA",
  "COMBUSTIBLE",
  "RACION",
];

export default function AddStockModal({ isOpen, onClose, onItemCreated }) {
  const { activeFarm } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "SEMILLA",
    unitOfMeasure: "kg",
    currentQuantity: "",
    minQuantityAlert: "",
    costPerUnitUsd: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeFarm?.id) return;
    setLoading(true);
    setError(null);

    try {
      await createStockItem({
        farmId: Number(activeFarm.id),
        name: form.name.trim(),
        category: form.category,
        unitOfMeasure: form.unitOfMeasure.trim().toLowerCase(),
        currentQuantity: parseFloat(form.currentQuantity) || 0,
        minQuantityAlert: parseFloat(form.minQuantityAlert) || 0,
        costPerUnitUsd: parseFloat(form.costPerUnitUsd) || 0,
      });

      onItemCreated();
      onClose();
      setForm({
        name: "",
        category: "SEMILLA",
        unitOfMeasure: "kg",
        currentQuantity: "",
        minQuantityAlert: "",
        costPerUnitUsd: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error al guardar",
      );
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
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "480px",
          color: "#f8fafc",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Cabecera */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PackagePlus size={18} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
              Alta de Insumo
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                padding: "0.6rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginBottom: "0.3rem",
              }}
            >
              Nombre del Insumo / Producto
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Semilla Maíz DK 72-10"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.55rem",
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "0.85rem",
                boxSizing: "border-box",
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
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "0.3rem",
                }}
              >
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.85rem",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "0.3rem",
                }}
              >
                Unidad de Medida
              </label>
              <input
                type="text"
                required
                placeholder="kg, lt, dosis, bolsa"
                value={form.unitOfMeasure}
                onChange={(e) =>
                  setForm({ ...form, unitOfMeasure: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.5rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "0.3rem",
                }}
              >
                Stock Inicial
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={form.currentQuantity}
                onChange={(e) =>
                  setForm({ ...form, currentQuantity: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "0.3rem",
                }}
              >
                Alerta Mín.
              </label>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={form.minQuantityAlert}
                onChange={(e) =>
                  setForm({ ...form, minQuantityAlert: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#94a3b8",
                  marginBottom: "0.3rem",
                }}
              >
                Costo (USD)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.costPerUnitUsd}
                onChange={(e) =>
                  setForm({ ...form, costPerUnitUsd: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.55rem",
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 0.85rem",
                backgroundColor: "transparent",
                border: "1px solid #1e293b",
                color: "#94a3b8",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#10b981",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {loading ? "Guardando..." : "Guardar Insumo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
