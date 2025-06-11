const { app } = require("./src/app.js");
const { testConnection } = require("./src/utils/testConnection.js");
const { syncDatabase, conn } = require("./src/db.js");
const {
  setTelegramWebhook,
} = require("./src/telegramBot/setTelegramWebhook.js");
const tokenRenewal = require("./src/utils/tokenRenewal.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com"; // URL de la API;

app.listen(PORT, async () => {
  try {
    await testConnection(); //pruebo primero la conexion a la base de datos
    await syncDatabase();
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    tokenRenewal.renewTokensPeriodically();
  } catch (error) {
    console.error("Error sincronizando la base de datos:", error);
  }
});

if (!URL_API || !URL_API.startsWith("https://")) {
  console.error("La URL del webhook debe ser HTTPS y válida.");
} else {
  console.log("Configurando el webhook de Telegram con URL:", URL_API);
  setTelegramWebhook(`${URL_API}/telegram/webhook`);
}
