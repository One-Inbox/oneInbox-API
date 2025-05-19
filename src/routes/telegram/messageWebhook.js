const { Router } = require("express");
const {
  Business,
  SocialMedia,
} = require("../../db");
const {newContactCreated} = require('../../utils/newContact');
const {newMsgReceived} = require('../../utils/newMsgReceived');
const {postNewMsgReceived} = require('../../utils/postNewMsgReceived')
//const axios = require("axios");

const messageWebhook = Router();

module.exports = (io) => {
 // Ruta para recibir mensajes
  messageWebhook.post("/webhook", async (req, res) => {
    console.log("Webhook alcanzado al recibir un mensaje");

    const businessId = "c3ea9d75-db7c-4dda-bca5-232d4a2b2ba1";
    const socialMediaId = 1; // ID de Telegram

    const { message } = req.body;
    if (!message) {
      console.error("No se recibió un mensaje en el body- No hay mensaje que procesar ");
      return res.status(200).send("No hay mensaje para procesar");
    }
  
    const chatId = message.chat.id.toString();
    console.log(chatId);
    
    const messageReceived = message.text;
    const senderName = message.from.first_name;
    const senderIdUser = message.from.id.toString();

    if (!messageReceived || typeof messageReceived !== "string" || messageReceived.trim() === "") {
      console.log("Mensaje sin texto o vacío recibido. No se procesará.");
      return res.status(200).send("Mensaje sin texto. Proceso finalizado.");
    }

    try {
//       Buscar o crear el contacto
      const newContact = await newContactCreated(senderIdUser, null, senderName, true, chatId,senderIdUser, businessId, socialMediaId);
//        Crear el mensaje recibido
    const timestamp = Date.now();

    const msgReceived = await newMsgReceived(chatId, senderIdUser, messageReceived, senderName, timestamp, chatId, businessId, "No Leidos", true, null, false, newContact, socialMediaId);
    console.log("PREGUNTA-TELEGRAM(WEBHOOK): Mensaje recibido guardado en la base de datos:", msgReceived);

    //     emito el mensaje a app
      if(msgReceived.processed) {
        const business = await Business.findByPk(businessId);
      // if (!business) {
      //   return res.status(404).send("Negocio no encontrado");
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
      // if (!socialMedia) {
      //   return res.status(404).send("Red Social no encontrada");
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
          Business: {id: business.id, name: business.name},
          state: "No Leidos",
          received: true,
          ContactId: newContact.id,
          Contact: {id: newContact.id, name: newContact.name, phone: newContact.phone },
          SocialMediumId: socialMediaId,
          SocialMedium: {id: socialMediaId, name: socialMedia.name, icon: socialMedia.icon}
        }
        console.log('TELEGRAM-PREGUNTA(WEBHOOK): creo la data para emitir');
        await postNewMsgReceived( msgReceivedData, res)
        console.log('TELEGRAM-PREGUNTA(WEBHOOK): emito el mensaje recibido a app');
      }
    } catch (error) {
      console.error("PREGUNTA-TELEGRAM(WEBHOOK): Error al procesar el mensaje en el webhook:", error);
      res.status(500).send("PREGUNTA-TELEGRAM(WEBHOOK):Error interno del servidor");
    }
  });

  return messageWebhook;
};

