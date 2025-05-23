const TelegramBot = require("node-telegram-bot-api");
const { Business, SocialMedia } = require("../db");
const { newContactCreated } = require("../utils/newContact");
const { newMsgReceived } = require("../utils/newMsgReceived");
const { postNewMsgReceived } = require("../utils/postNewMsgReceived");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
//const bot = new TelegramBot(botToken, {polling: true});
const bot = new TelegramBot(botToken);

const businessId = process.env.BUSINESS_ID;
const socialMediaId = 1; //este es el id de telegram

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderIdUser = msg.from.id;
  //console.log("msg: ", msg);

  try {
    // Buscar o crear el contacto
    const newContact = await newContactCreated(
      senderIdUser,
      null,
      senderName,
      true,
      chatId,
      senderIdUser,
      businessId,
      socialMediaId
    );

    // Crear el mensaje recibido
    const timestamp = Date.now();
    const msgReceived = await newMsgReceived(
      chatId,
      msg.from.id,
      message,
      senderName,
      timestamp,
      chatId,
      businessId,
      "No Leidos",
      true,
      null,
      false,
      newContact,
      socialMediaId
    );
    console.log(
      "PREGUNTA-TELEGRAM(BOT): Mensaje recibido guardado en la base de datos:",
      msgReceived
    );

    //emito el mensaje a app
    if (msgReceived.processed) {
      const business = await Business.findByPk(businessId);
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      const msgReceivedData = {
        id: msgReceived.id,
        chatId: msgReceived.chatId,
        idUser: msgReceived.idUser,
        text: msgReceived.text,
        name: msgReceived.name,
        timestamp: msgReceived.timestamp,
        phoneNumber: msgReceived.phoneNumber,
        userName: msgReceived.userName,
        BusinessId: businessId,
        Business: { id: business.id, name: business.name },
        state: "No Leidos",
        received: true,
        ContactId: newContact.id,
        Contact: {
          id: newContact.id,
          name: newContact.name,
          phone: newContact.phone,
        },
        SocialMediumId: socialMediaId,
        SocialMedium: {
          id: socialMediaId,
          name: socialMedia.name,
          icon: socialMedia.icon,
        },
      };
      console.log("TELEGRAM-PREGUNTA: creo la data para emitir");
      await postNewMsgReceived(msgReceivedData, res);
      console.log("TELEGRAM-PREGUNTA: emito el mensaje recibido a app");
    }
  } catch (error) {
    console.error(
      "TELEGRAM - PREGUNTA: Error al guardar el mensaje recibido en la base de datos:",
      error
    );
  }

  // // Respuesta automática (comento porque no esta funcionando)
  // bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
});

module.exports = { bot };
