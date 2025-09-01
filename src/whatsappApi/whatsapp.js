const {
  MsgReceived,
  MsgSent,
  Contacts,
  Business,
  SocialMedia,
  User,
} = require("../db");
const axios = require("axios");
require("dotenv").config();
const { newContactCreated } = require("../utils/newContact");
const { newMsgReceived } = require("../utils/newMsgReceived");
const { postNewMsgReceived } = require("../utils/postNewMsgReceived");
const {
  sendAutomaticResponse,
} = require("../utils/automaticResponse/sendAutomaticResponse");
require("dotenv").config();

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";
const socialMediaId = 2; // Este es el id de WhatsApp en SocialMedia
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API

const BUSINESS_PHONE_NUMBER_ID =
  process.env.BUSINESS_PHONE_NUMBER_ID || 493353500531078;

const handleMessage = async (messageAllData) => {
  const msg = messageAllData.messages[0];
  const dataContact = messageAllData.contacts[0];

  const chatId = msg.id; //deberia se  msg.id, pero hayque cambiar el modelo contacto, ya que es un string y no un numero(bigInt)
  const message = msg.text.body;
  const senderPhoneNumber = msg.from;
  const senderUserId = dataContact.wa_id ? dataContact.wa_id : chatId;
  const senderName = dataContact.profile
    ? dataContact.profile.name
    : senderPhoneNumber
    ? senderPhoneNumber
    : "Usuario";
  const externalId = `WSP-${msg.id}` || null; // item agregado: Este campo puede ser opcional

  try {
    // Buscar o crear el contacto
    const newContact = await newContactCreated(
      senderUserId,
      null,
      senderName,
      true,
      chatId,
      senderPhoneNumber,
      businessId,
      socialMediaId
    );

    // Crear el mensaje recibido
    const timestamp = Date.now();
    const msgReceived = await newMsgReceived(
      chatId,
      senderUserId,
      message,
      senderName,
      timestamp,
      externalId, // item agregado: Este campo puede ser opcional
      senderPhoneNumber,
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
    // console.log(
    //   "WHATSAPP-PREGUNTA: mensaje recibido guardado en la base de datos:"
    // );

    //emitir mensaje a app
    if (msgReceived.processed) {
      const business = await Business.findByPk(businessId);
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      const socialMediaData = socialMedia.dataValues;
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
          name: socialMedia.name ? socialMedia.name : socialMediaData.name,
          icon: socialMedia.icon ? socialMedia.icon : socialMediaData.icon,
        },
      };
      // await postNewMsgReceived(msgReceivedData, null);
      // await sendAutomaticResponse(msgReceivedData);
      try {
        await postNewMsgReceived(msgReceivedData);
      } catch (err) {
        console.error("Error al guardar mensaje:", err.message);
      }

      // Intentar enviar respuesta automática siempre
      try {
        await sendAutomaticResponse(msgReceivedData);
      } catch (err) {
        console.error("Error al enviar respuesta automática:", err.message);
      }

      console.log("Mensaje procesado correctamente en WhatsApp");
      return;
    }
  } catch (error) {
    console.error(
      "WHATSAPP-PREGUNTA: Error al guardar el mensaje de WhatsApp recibido en la base de datos:",
      error
    );
  }
};

module.exports = { handleMessage };
