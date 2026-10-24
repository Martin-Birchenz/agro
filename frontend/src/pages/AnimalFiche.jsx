import { useState, useEffect } from "react";
import {
  getAnimalFiche,
  getCategories,
  registerAnimalManual,
} from "../services/weighing.service";
import { getPaddocksList } from "../services/paddock.service";
import { downloadPesajesCsvUrl } from "../services/report.service";
import { UserPlus, X, CheckCircle2, Download } from "lucide-react";

export default function AnimalFiche() {
  const [rfidTag, setRfidTag] = useState("982000555666777");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados del modal de alta manual
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [paddocks, setPaddocks] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    rfidTag: "",
    visualTag: "",
    categoryId: 1,
    paddockId: 1,
    initialWeight: 200,
    targetSaleWeight: 340,
    targetGdpv: 0.85,
  });

  const fetchFiche = async (tag) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAnimalFiche(tag);
      setData(result);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiche(rfidTag);
  }, []);

  const openRegisterModal = async () => {
    try {
      const [cats, pads] = await Promise.all([
        getCategories(),
        getPaddocksList(),
      ]);
      setCategories(cats || []);
      setPaddocks(pads || []);
      if (cats && cats.length > 0)
        setForm((prev) => ({ ...prev, categoryId: cats[0].id }));
      if (pads && pads.length > 0)
        setForm((prev) => ({ ...prev, paddockId: pads[0].id }));
      setShowModal(true);
    } catch (err) {
      alert("Error al cargar datos auxiliares: " + err.message);
    }
  };

  const handleRegisterAnimal = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await registerAnimalManual({
        rfidTag: form.rfidTag.trim(),
        visualTag: form.visualTag.trim() || null,
        categoryId: Number(form.categoryId),
        paddockId: Number(form.paddockId),
        initialWeight: Number(form.initialWeight),
        targetSaleWeight: Number(form.targetSaleWeight),
        targetGdpv: Number(form.targetGdpv),
      });
      setShowModal(false);
      setSuccessMsg(`Animal ${form.rfidTag} registrado con éxito.`);
      setRfidTag(form.rfidTag.trim());
      fetchFiche(form.rfidTag.trim());
    } catch (err) {
      alert("Error al registrar animal: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Trazabilidad Individual ISO 11784/11785
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Evolución cronológica y métricas zootécnicas
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={rfidTag}
            onChange={(e) => setRfidTag(e.target.value)}
            placeholder="Caravana RFID (15 dígitos)"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              fontSize: "0.9rem",
              width: "220px",
            }}
          />
          <button
            onClick={() => fetchFiche(rfidTag)}
            style={{
              backgroundColor: "var(--agro-green)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Consultar
          </button>
          <button
            onClick={openRegisterModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "var(--agro-blue)",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <UserPlus size={16} /> + Registrar Animal
          </button>
        </div>
      </div>

      {successMsg && (
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
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {loading && <div className="card">Cargando ficha zootécnica...</div>}
      {error && (
        <div className="card" style={{ color: "#dc2626" }}>
          Error: {error}
        </div>
      )}

      {data && (
        <>
          <div className="grid-metrics">
            <div className="metric-card">
              <div className="metric-label">Caravana RFID</div>
              <div className="metric-value" style={{ fontSize: "1.3rem" }}>
                {data.trazabilidad.rfidTag}
              </div>
              <div className="metric-sub">
                {data.trazabilidad.categoria} ({data.trazabilidad.sexo})
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Último Peso Registrado</div>
              <div className="metric-value">
                {data.estadoActual?.ultimoPesoKg ?? "--"} kg
              </div>
              <div className="metric-sub">
                Meta de venta: {data.objetivos.pesoVentaObjetivoKg} kg
              </div>
            </div>

            <div
              className="metric-card"
              style={{ borderLeft: "4px solid var(--agro-blue)" }}
            >
              <div className="metric-label">GDPV Lograda (Módulo 06)</div>
              <div
                className="metric-value"
                style={{ color: "var(--agro-blue)" }}
              >
                {data.estadoActual?.gdpvActualGramosDia ?? "--"} g/día
              </div>
              <div className="metric-sub">
                Objetivo: {data.objetivos.gdpvObjetivoKgDia * 1000} g/día
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Proyección a Venta/Faena</div>
              <div className="metric-value">
                {data.estadoActual?.diasRestantesFaena ?? "--"} días
              </div>
              <div className="metric-sub">
                Estimado al ritmo de ganancia real
              </div>
            </div>
          </div>

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
                Serie Histórica de Balanza
              </h3>
              <a
                href={downloadPesajesCsvUrl()}
                download
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  color: "var(--text-main)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                <Download size={16} /> Exportar CSV (Excel)
              </a>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Transacción</th>
                    <th>Fecha y Hora</th>
                    <th>Peso (kg)</th>
                    <th>Días</th>
                    <th>Ganancia (kg)</th>
                    <th>GDPV Real (g/día)</th>
                    <th>Δ Brecha (g/día)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pesajesHistoricos.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "monospace" }}>
                        {p.client_transaction_id}
                      </td>
                      <td>{new Date(p.weighed_at).toLocaleDateString()}</td>
                      <td>
                        <strong>{p.weight} kg</strong>
                      </td>
                      <td>{p.days_elapsed ?? "-"}</td>
                      <td>{p.weight_gain ? `+${p.weight_gain} kg` : "-"}</td>
                      <td>
                        {p.gdpv_real ? (
                          <span className="badge badge-green">
                            {p.gdpv_real} g/d
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>
                            Base inicial
                          </span>
                        )}
                      </td>
                      <td>{p.gdpv_gap !== null ? `${p.gdpv_gap} g/d` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Registro Manual */}
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
              maxWidth: "550px",
              maxHeight: "90vh",
              overflowY: "auto",
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
                Registrar Animal Manualmente
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
              onSubmit={handleRegisterAnimal}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label className="metric-label">
                  Caravana RFID (15 dígitos)
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  minLength={15}
                  placeholder="Ej: 982000123456789"
                  value={form.rfidTag}
                  onChange={(e) =>
                    setForm({ ...form, rfidTag: e.target.value })
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
                  Caravana Visual (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: ROJO-45"
                  value={form.visualTag}
                  onChange={(e) =>
                    setForm({ ...form, visualTag: e.target.value })
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
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="metric-label">Categoría</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.ev_coefficient} EV)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="metric-label">Potrero Inicial</label>
                  <select
                    value={form.paddockId}
                    onChange={(e) =>
                      setForm({ ...form, paddockId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--border-color)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {paddocks.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="metric-label">Peso Inicial Base (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={form.initialWeight}
                    onChange={(e) =>
                      setForm({ ...form, initialWeight: e.target.value })
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
                  <label className="metric-label">Meta Peso Venta (kg)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={form.targetSaleWeight}
                    onChange={(e) =>
                      setForm({ ...form, targetSaleWeight: e.target.value })
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
                    background: "var(--agro-blue)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {modalLoading ? "Registrando..." : "Guardar Animal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
