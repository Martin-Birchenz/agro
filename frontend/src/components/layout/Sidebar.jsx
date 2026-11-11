import { NavLink } from "react-router-dom";
import { Beef, Sprout, Package, Calculator, MapPin, Gauge } from "lucide-react";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.55rem 0.75rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: isActive ? "600" : "500",
    color: isActive ? "#ffffff" : "#94a3b8",
    backgroundColor: isActive ? "#10b981" : "transparent",
    transition: "background-color 0.15s ease, color 0.15s ease",
  });

  const sectionTitleStyle = {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748b",
    marginBottom: "0.35rem",
    paddingLeft: "0.5rem",
    fontWeight: "600",
  };

  return (
    <aside
      style={{
        width: "230px",
        minHeight: "100vh",
        backgroundColor: "#0b1329",
        borderRight: "1px solid #1e293b",
        padding: "1.25rem 0.85rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            margin: 0,
            color: "#f8fafc",
          }}
        >
          Agro Gestión 🌾🐄
        </h2>
        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
          ERP Agropecuario Modular
        </span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* GANADERÍA */}
        <div>
          <div style={sectionTitleStyle}>Ganadería</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <NavLink to="/potreros" style={linkStyle}>
              <MapPin size={17} />
              <span>Potreros y Pastoreo</span>
            </NavLink>
            <NavLink to="/animales" style={linkStyle}>
              <Beef size={17} />
              <span>Hacienda y Balanza</span>
            </NavLink>
            <NavLink to="/calculadoras" style={linkStyle}>
              <Calculator size={17} />
              <span>Modelado Zootécnico</span>
            </NavLink>
            <NavLink to="/laboratorio" style={linkStyle}>
              <Gauge size={17} />
              <span>Laboratorio Zootécnico</span>
            </NavLink>
          </div>
        </div>

        {/* AGRICULTURA */}
        <div>
          <div style={sectionTitleStyle}>Agricultura</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <NavLink to="/agricultura" style={linkStyle}>
              <Sprout size={17} />
              <span>Lotes y Campañas</span>
            </NavLink>
          </div>
        </div>

        {/* ADMINISTRACIÓN */}
        <div>
          <div style={sectionTitleStyle}>Administración</div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <NavLink to="/stock" style={linkStyle}>
              <Package size={17} />
              <span>Galpón e Insumos</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}
