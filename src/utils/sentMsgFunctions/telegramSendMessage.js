const TelegramBot = require("node-telegram-bot-api");
const { newMsgSent } = require("../newMsgSent");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(botToken);

const telegramSendMessage = async (
  chatId,
  message,
  userId,
  businessId,
  contactId
) => {
  try {
    // Envía el mensaje
    await bot.sendMessage(chatId, message);
    const botUsername = bot.options.username || "Matias";

    // Guarda el mensaje enviado en la base de datos
    const timestamp = Date.now();
    const msgSent = await newMsgSent(
      botUsername,
      "Telegram",
      chatId,
      message,
      chatId,
      timestamp,
      businessId,
      false,
      contactId,
      userId
    );
    //retorno un objeto para emitir a app
    return {
      success: true,
      message: "TELEGRAM: Respuesta enviada correctamente",
      msgSent,
    };
  } catch (error) {
    console.error(
      "TELEGRAM: Error al enviar y guardar la respuesta manual:",
      error
    );
    return {
      success: false,
      message: "TELEGRAM: Error al enviar y guardar la respuesta manual",
    };
  }
};

module.exports = { bot, telegramSendMessage };
