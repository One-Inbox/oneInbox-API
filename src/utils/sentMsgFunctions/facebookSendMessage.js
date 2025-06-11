const axios = require("axios");
require("dotenv").config();
const { Business } = require("../../db");
const { newMsgSent } = require("../newMsgSent");

const facebookSendMessage = async (
  chatId,
  message,
  userId,
  businessId,
  contactId
) => {
  try {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; //este token se saca de meta developers en el dashboard de la app
    const messageData = {
      recipient: {
        id: chatId,
      },
      message: {
        text: message,
      },
    };
    const response = await axios.post(
      `https://graph.facebook.com/v15.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      messageData
    );

    // Guarda el mensaje enviado en la base de datos
    const business = await Business.findByPk(businessId);
    const businessName = business ? business.name : "empresa";
    const timestamp = Date.now();
    const msgSent = await newMsgSent(
      businessName,
      "Facebook",
      chatId,
      message,
      chatId,
      timestamp,
      businessId,
      false,
      contactId,
      userId
    );

    //creo objeto para emitir a app
    return {
      success: true,
      message: "FACEBOOK: Respuesta enviada correctamente",
      msgSent,
    };
  } catch (error) {
    console.error(
      "Error al enviar mensaje de facebook:",
      error.response ? error.response.data : error.message
    );

    return {
      success: false,
      message: "FACEBOOK: Error al enviar y guardar la respuesta manual",
    };
  }
};

module.exports = { facebookSendMessage };
