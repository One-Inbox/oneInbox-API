require("dotenv").config();
const axios = require("axios");
const { newMsgSent } = require("../newMsgSent");
const { Business } = require("../../db");

const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API
const BUSINESS_PHONE_NUMBER_ID =
  process.env.BUSINESS_PHONE_NUMBER_ID || 493353500531078;

const whatsappSendMessage = async (
  chatId,
  message,
  userId,
  phone,
  businessId,
  contactId
) => {
  if (!chatId || !message || !userId || !phone || !businessId)
    throw new Error("Missing data");

  try {
    const response = await axios({
      url: `https://graph.facebook.com/v21.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
      method: "post",
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "text",
        text: {
          body: message,
        },
      }),
    });

    // Guarda el mensaje enviado en la base de datos
    const business = await Business.findByPk(businessId);
    const businessName = business ? business.name : "empresa";
    const timestamp = Date.now();
    const msgSent = await newMsgSent(
      businessName,
      "WhatsApp",
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
      message: "WhatsApp: Respuesta enviada correctamente",
      msgSent,
    };
  } catch (error) {
    // Logs de error para depurar
    console.error(
      "Error al enviar el mensaje a WhatsApp:",
      error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    return {
      success: false,
      message: "WhatsApp : Error al enviar y guardar la respuesta",
    };
  }
};
module.exports = { whatsappSendMessage };
