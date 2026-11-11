import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import FarmSelector from "../FarmSelector.jsx";

export default function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header
          className="topbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FarmSelector />
        </header>
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
