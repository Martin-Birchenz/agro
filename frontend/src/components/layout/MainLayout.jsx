import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Establecimiento: <strong>El Ombú (Nogoyá, Entre Ríos)</strong>
          </div>
          <div>
            <span className="badge badge-green">
              Sistema en Línea (MySQL Activo)
            </span>
          </div>
        </header>
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
