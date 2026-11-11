import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FarmProvider } from "./context/FarmContext";
import MainLayout from "./components/layout/MainLayout";
import PaddockManager from "./pages/PaddockManager";
import AnimalFiche from "./pages/AnimalFiche";
import ZootechnicsLab from "./pages/ZootechnicsLab";
import ZootechnicsDashboard from "./pages/ZootechnicsDashboard";
import StockManager from "./pages/StockManager";
import AgricultureManager from "./pages/AgricultureManager";

export default function App() {
  return (
    <FarmProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/potreros" replace />} />

            {/* Ganadería */}
            <Route path="potreros" element={<PaddockManager />} />
            <Route path="animales" element={<AnimalFiche />} />
            <Route path="laboratorio" element={<ZootechnicsLab />} />
            <Route path="calculadoras" element={<ZootechnicsDashboard />} />

            {/* Agricultura */}
            <Route path="agricultura" element={<AgricultureManager />} />

            {/* Administración */}
            <Route path="stock" element={<StockManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FarmProvider>
  );
}
