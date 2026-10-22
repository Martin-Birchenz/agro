import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado a la base de datos MySQL de Agro Gestión");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Servidor activo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}

startServer();
