import { NavLink } from "react-router-dom";
import { Activity, Scale, Compass, Cpu } from "lucide-react";

export default function Sidebar() {
  const navItems = [
    { name: "Monitoreo de Potrero", path: "/potreros", icon: Compass },
    { name: "Ficha de Animal (RFID)", path: "/animales", icon: Scale },
    { name: "Simulador Zootécnico", path: "/laboratorio", icon: Activity },
  ];

  return (
    <aside className="sidebar">
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #1e293b",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#22c55e",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Cpu size={22} /> AGRO GESTIÓN
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          Hardware + Motor Zootécnico
        </span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isActive ? "#ffffff" : "#94a3b8",
                backgroundColor: isActive ? "#1e293b" : "transparent",
              })}
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
