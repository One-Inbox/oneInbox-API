const { syncDatabase, conn } = require("../db.js");
const testConnection = async () => {
  try {
    await conn.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
};

module.exports = { testConnection };
