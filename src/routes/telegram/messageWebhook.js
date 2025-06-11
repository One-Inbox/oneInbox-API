const { Router } = require("express");
const { Business, SocialMedia } = require("../../db");
const { newContactCreated } = require("../../utils/newContact");
const { newMsgReceived } = require("../../utils/newMsgReceived");
const { postNewMsgReceived } = require("../../utils/postNewMsgReceived");
require("dotenv").config();

const myBusinessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";

const messageWebhook = Router();

module.exports = (io) => {
  // Ruta para recibir mensajes
  messageWebhook.post("/webhook", async (req, res) => {
    const businessId = myBusinessId;
    const socialMediaId = 1; // ID de Telegram

    const { message } = req.body;
    if (!message) {
      console.error(
        "No se recibió un mensaje en el body- No hay mensaje que procesar "
      );
      return res.status(200).send("telegram: No hay mensaje para procesar");
    }

    const chatId = message.chat.id.toString();
    console.log(chatId);

    const messageReceived = message.text;
    const senderName = message.from.first_name;
    const senderIdUser = message.from.id.toString();
    const externalId = `TL-${message.message_id}` || null; // Este campo puede ser opcional

    if (
      !messageReceived ||
      typeof messageReceived !== "string" ||
      messageReceived.trim() === ""
    ) {
      console.log(
        "telegram: Mensaje sin texto o vacío recibido. No se procesará."
      );
      return res.status(200).send("Mensaje sin texto. Proceso finalizado.");
    }

    try {
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

      const timestamp = Date.now();
      const msgReceived = await newMsgReceived(
        chatId,
        senderIdUser,
        messageReceived,
        senderName,
        timestamp,
        externalId, // Item agregado; Este campo puede ser opcional
        chatId,
        businessId,
        "No Leidos",
        true,
        null,
        false,
        newContact,
        socialMediaId
      );

      //     emito el mensaje a app
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
        await postNewMsgReceived(msgReceivedData, res);
      }
    } catch (error) {
      console.error(
        "PREGUNTA-TELEGRAM(WEBHOOK): Error al procesar el mensaje en el webhook:",
        error
      );
      res
        .status(500)
        .send("PREGUNTA-TELEGRAM(WEBHOOK):Error interno del servidor");
    }
  });

  return messageWebhook;
};
