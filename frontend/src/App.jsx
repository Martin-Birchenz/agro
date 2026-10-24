import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import PaddockManager from "./pages/PaddockManager";
import AnimalFiche from "./pages/AnimalFiche";
import ZootechnicsLab from "./pages/ZootechnicsLab";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/potreros" replace />} />
          <Route path="potreros" element={<PaddockManager />} />
          <Route path="animales" element={<AnimalFiche />} />
          <Route path="laboratorio" element={<ZootechnicsLab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
