const { app } = require("./src/app.js");
const { testConnection } = require("./src/utils/testConnection.js");
const { syncDatabase, conn } = require("./src/db.js");
//const { bot } = require("./src/telegramBot/telegramBot.js");
const {
  setTelegramWebhook,
} = require("./src/telegramBot/setTelegramWebhook.js");
const tokenRenewal = require("./src/utils/tokenRenewal.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
//const URL_API = process.env.URL_API || "http://localhost:3000"; //
const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com"; // URL de la APIS;

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

// app.listen(PORT, async () => {
// //server.listen(PORT, async () => {
//   try {
//     await syncDatabase();
//     console.log(`% listening at ${PORT}`);
//     // Llama a la función para iniciar la renovación automática del access token de meli
//     tokenRenewal.renewTokensPeriodically();  // Inicia la renovación automática
//     //console.log("ejectuando tokenRenewal")
//   } catch (error) {
//     console.error('Error synchronizing and backfilling database:', error);
//   }
// });

// const setTelegramWebhook = async (url, retries = 5, delay = 3000) => {
//   try {
//     console.log("Configurando el webhook de telegram con URL:", url);
//     const response = await bot.setWebHook(url);
//     if (response) {
//       console.log("Webhook de telegram configurado correctamente:", response);
//     } else {
//       console.error("Error al configurar el webhook:", error.message);
//       console.log("reintentado configuracion");
//       if (retries > 0) {
//         console.log(
//           `Reintentando configuración en ${
//             delay / 1000
//           } segundos... (Intentos restantes: ${retries})`
//         );
//         setTimeout(() => {
//           setTelegramWebhook(url, retries - 1, delay); // Reintenta después del timeout
//         }, delay);
//       } else {
//         console.error(
//           "Se han agotado los intentos de configuración del webhook."
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error al configurar el webhook de Telegram:", error.message);
//   }
// };
console.log("estoy tomadndo como URL en index: ", URL_API);
if (!URL_API || !URL_API.startsWith("https://")) {
  console.error("La URL del webhook debe ser HTTPS y válida.");
} else {
  console.log("Configurando el webhook de Telegram con URL:", URL_API);
  setTelegramWebhook(`${URL_API}/telegram/webhook`);
}

// DESARROLLO
//const URL = "https://electrica-mosconi-backend.onrender.com/telegram/webhook";
//PRODUCCION
// const URL =
//   "https://electrica-mosconi-backend-main.onrender.com/telegram/webhook";

//setTelegramWebhook(URL);
