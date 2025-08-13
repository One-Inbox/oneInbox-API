const TelegramBot = require("node-telegram-bot-api");
const { Business, SocialMedia } = require("../db");
const { newContactCreated } = require("../utils/newContact");
const { newMsgReceived } = require("../utils/newMsgReceived");
const { postNewMsgReceived } = require("../utils/postNewMsgReceived");
const {
  sendAutomaticResponse,
} = require("../utils/automaticResponse/sendAutomaticResponse");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken);

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";
const socialMediaId = 1; //este es el id de telegram

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderIdUser = msg.from.id;
  const idUser = senderIdUser.toString(); // Asegurarse de que sea una cadena
  const externalId = `TL-${msg.message_id}` || null; // Este campo puede ser opcional

  try {
    const newContact = await newContactCreated(
      idUser,
      null,
      senderName,
      true,
      chatId,
      senderIdUser,
      businessId,
      socialMediaId
    );

    const timestamp = Date.now();
    const msgReceived = await newMsgReceived(
      chatId,
      msg.from.id,
      message,
      senderName,
      timestamp,
      externalId, //item agregado: Este campo puede ser opcional
      chatId,
      businessId,
      "No Leidos",
      true,
      null,
      false,
      null, // idSeller: item agregado: Este campo puede ser opcional
      null, // idBuyer: item agregado: Este campo puede ser opcional
      newContact,
      socialMediaId
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
        externalId: msgReceived.externalId, // Item agregado: Este campo puede ser opcional
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

      await postNewMsgReceived(msgReceivedData);
      await sendAutomaticResponse(msgReceivedData);
    }
  } catch (error) {
    console.error(
      "TELEGRAM - PREGUNTA: Error al guardar el mensaje recibido en la base de datos:",
      error
    );
  }
});

module.exports = { bot };
