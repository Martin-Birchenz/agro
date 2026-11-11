import { useState, useEffect } from "react";
import { useFarm } from "../context/FarmContext";
import { getFarmStock, adjustStock } from "../services/stock.service";
import AddStockModal from "../components/AddStockModal";
import {
  Package,
  Plus,
  Minus,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  PlusCircle,
  DollarSign,
} from "lucide-react";

export default function StockManager() {
  const { activeFarm } = useFarm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStock = async () => {
    if (!activeFarm?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getFarmStock(activeFarm.id);
      setItems(data || []);
    } catch (err) {
      setError(err.message || "Error al cargar stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [activeFarm?.id]);

  const handleAdjust = async (id, delta) => {
    try {
      await adjustStock(id, delta, "Ajuste rápido manual");
      fetchStock();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Métricas calculadas
  const totalValuationUsd = items.reduce(
    (acc, it) =>
      acc + Number(it.current_quantity) * Number(it.cost_per_unit_usd),
    0,
  );

  const lowStockCount = items.filter(
    (it) => Number(it.current_quantity) <= Number(it.min_quantity_alert),
  ).length;

  return (
    <div>
      {/* Encabezado */}
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
            Galpón de Insumos & Stock
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              margin: "0.25rem 0 0 0",
            }}
          >
            Control transversal para Ganadería y Agricultura en{" "}
            {activeFarm?.name || "el campo"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "var(--agro-green, #10b981)",
              border: "none",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            <PlusCircle size={16} /> + Nuevo Insumo
          </button>
          <button
            onClick={fetchStock}
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
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas del Galpón */}
      <div className="grid-metrics" style={{ marginBottom: "1.5rem" }}>
        <div className="metric-card">
          <div className="metric-label">Insumos Registrados</div>
          <div className="metric-value">{items.length}</div>
          <div className="metric-sub">Líneas de producto activas</div>
        </div>

        <div
          className="metric-card"
          style={{
            borderLeft:
              lowStockCount > 0
                ? "4px solid #ef4444"
                : "4px solid var(--border-color)",
          }}
        >
          <div className="metric-label">Alertas de Reposición</div>
          <div
            className="metric-value"
            style={{ color: lowStockCount > 0 ? "#ef4444" : "inherit" }}
          >
            {lowStockCount}
          </div>
          <div className="metric-sub">Por debajo del stock mínimo</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Valorización de Stock</div>
          <div
            className="metric-value"
            style={{ color: "var(--agro-blue, #3b82f6)" }}
          >
            USD $
            {totalValuationUsd.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="metric-sub">Capital inmovilizado en insumos</div>
        </div>
      </div>

      {loading && <div className="card">Cargando inventario...</div>}
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

      {items.length > 0 && (
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Alerta Mínima</th>
                  <th>Costo Unit. (USD)</th>
                  <th>Subtotal Valuado</th>
                  <th style={{ textAlign: "right" }}>Ajuste Rápido</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLow =
                    Number(item.current_quantity) <=
                    Number(item.min_quantity_alert);
                  const subtotal =
                    Number(item.current_quantity) *
                    Number(item.cost_per_unit_usd);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          {isLow && (
                            <AlertTriangle
                              size={15}
                              color="#ef4444"
                              title="Stock por debajo del mínimo"
                            />
                          )}
                          <strong>{item.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "rgba(100, 116, 139, 0.2)",
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <strong
                          style={{ color: isLow ? "#ef4444" : "inherit" }}
                        >
                          {Number(item.current_quantity).toLocaleString()}{" "}
                          {item.unit_of_measure}
                        </strong>
                      </td>
                      <td>
                        {Number(item.min_quantity_alert).toLocaleString()}{" "}
                        {item.unit_of_measure}
                      </td>
                      <td>USD ${Number(item.cost_per_unit_usd).toFixed(2)}</td>
                      <td>
                        USD $
                        {subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.3rem" }}>
                          <button
                            onClick={() => handleAdjust(item.id, -1)}
                            style={{
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-card)",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            title="Descontar 1 unidad"
                          >
                            <Minus size={14} />
                          </button>
                          <button
                            onClick={() => handleAdjust(item.id, 1)}
                            style={{
                              border: "1px solid var(--border-color)",
                              background: "var(--bg-card)",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            title="Ingresar 1 unidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para alta manual de insumos */}
      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemCreated={fetchStock}
      />
    </div>
  );
}
