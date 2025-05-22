const { bot } = require("./telegramBot.js");

const setTelegramWebhook = async (url, retries = 5, delay = 3000) => {
  try {
    console.log("Configurando el webhook de telegram con URL:", url);
    const response = await bot.setWebHook(url);
    if (response) {
      console.log("Webhook de telegram configurado correctamente:", response);
    } else {
      console.error("Error al configurar el webhook:", error.message);
      console.log("reintentado configuracion");
      if (retries > 0) {
        console.log(
          `Reintentando configuración en ${
            delay / 1000
          } segundos... (Intentos restantes: ${retries})`
        );
        setTimeout(() => {
          setTelegramWebhook(url, retries - 1, delay); // Reintenta después del timeout
        }, delay);
      } else {
        console.error(
          "Se han agotado los intentos de configuración del webhook."
        );
      }
    }
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};

module.exports = { setTelegramWebhook };
