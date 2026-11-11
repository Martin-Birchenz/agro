import { createContext, useContext, useState, useEffect } from "react";
import { getFarmsList } from "../services/admin.service";

const FarmContext = createContext();

export function FarmProvider({ children }) {
  const [farms, setFarms] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [loadingFarms, setLoadingFarms] = useState(true);

  const loadFarms = async () => {
    try {
      setLoadingFarms(true);
      const data = await getFarmsList();
      setFarms(data || []);

      const savedId = localStorage.getItem("active_farm_id");
      const found = data.find((f) => String(f.id) === savedId);

      if (found) {
        setActiveFarm(found);
      } else if (data.length > 0) {
        setActiveFarm(data[0]);
        localStorage.setItem("active_farm_id", data[0].id);
      }
    } catch (err) {
      console.error("Error al cargar establecimientos:", err);
    } finally {
      setLoadingFarms(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const changeFarm = (farmId) => {
    const selected = farms.find((f) => String(f.id) === String(farmId));
    if (selected) {
      setActiveFarm(selected);
      localStorage.setItem("active_farm_id", selected.id);
    }
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        activeFarm,
        changeFarm,
        refreshFarms: loadFarms,
        loadingFarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error("useFarm debe usarse dentro de un FarmProvider");
  }
  return context;
}
