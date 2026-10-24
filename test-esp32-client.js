const SERVER_URL = "http://localhost:3000/api/weighings/batch-sync";
const DEVICE_ID = "BALANZA-MANGA-ESP32-01";

// 1. Simulación de los registros almacenados en la Flash NVS
const fakeNvsFlash = [
  {
    clientTransactionId: "TX-ESP32-ANIMAL2-001",
    rfidTag: "982000555666777",
    weight: 200.0,
    weighedAt: "2026-08-01T08:00:00.000Z",
  },
  {
    clientTransactionId: "TX-ESP32-ANIMAL2-002",
    rfidTag: "982000555666777",
    weight: 236.0,
    weighedAt: "2026-09-15T09:00:00.000Z",
  },
];

async function simularCicloESP32() {
  console.log("\n=== INICIANDO SIMULADOR DE FIRMWARE ESP32 ===");
  console.log(`[NVS] Registros pendientes en Flash: ${fakeNvsFlash.length}`);

  if (fakeNvsFlash.length === 0) {
    console.log("[SYNC] No hay datos para sincronizar.");
    return;
  }

  const payload = {
    deviceId: DEVICE_ID,
    weighings: fakeNvsFlash,
  };

  try {
    console.log(`[HTTP] Transmitiendo lote hacia: ${SERVER_URL}...`);
    const res = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(`[HTTP] Código de respuesta: ${res.status}`);
    console.log("[HTTP] Payload recibido:", JSON.stringify(data, null, 2));

    if (res.ok) {
      console.log("[NVS] ¡Servidor confirmó recepción!");
      // Purgado de memoria Flash NVS
      fakeNvsFlash.length = 0;
      console.log(
        `[NVS] Memoria purgada. Registros restantes en Flash: ${fakeNvsFlash.length}`,
      );
    } else {
      console.error("[HTTP] Error reportado por el backend.");
    }
  } catch (error) {
    console.error("[HTTP] Falla de conexión con el backend:", error.message);
  }
}

simularCicloESP32();
