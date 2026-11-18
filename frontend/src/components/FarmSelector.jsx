import { useFarm } from "../context/FarmContext";
import { MapPin } from "lucide-react";

export default function FarmSelector() {
  const { farms, activeFarm, changeFarm, loadingFarms } = useFarm();

  if (loadingFarms) {
    return (
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Cargando campos...
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={{ fontSize: "0.85rem", color: "#f59e0b" }}>
        Sin establecimientos
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "var(--bg-card, #1e293b)",
        padding: "0.35rem 0.75rem",
        borderRadius: "8px",
        border: "1px solid var(--border-color, #334155)",
      }}
    >
      <MapPin size={16} color="var(--agro-green, #10b981)" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <select
          value={activeFarm ? activeFarm.id : ""}
          onChange={(e) => changeFarm(e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#000000",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            outline: "none",
            paddingRight: "1rem",
          }}
        >
          {farms.map((f) => (
            <option
              key={f.id}
              value={f.id}
              style={{ backgroundColor: "#0f172a", color: "#fff" }}
            >
              {f.name} ({Number(f.total_surface_ha).toFixed(0)} ha)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
