const axios = require("axios");
const { newMsgSent } = require("../newMsgSent");
const { Business } = require("../../db");

const mercadoLibreSendMessage = async (
  chatId,
  message,
  userId,
  accessToken,
  businessId,
  contactId
) => {
  //console.log('MELI-RESPUESTA: props en funcion de Meli: chatId:', chatId, 'message:', message, 'userId:', userId, 'token:', accessToken, 'businessId:', businessId, 'contactId:', contactId);

  if (!chatId || !message || !userId || !accessToken || !businessId)
    throw new Error("Missing data");
  try {
    const response = await axios.post(
      `https://api.mercadolibre.com/answers?access_token=${accessToken}`,
      {
        question_id: chatId,
        text: message,
      }
    );
    console.log(
      "MELI-RESPUESTA: Mensaje de MERCADO LIBRE enviado:",
      response.data
    );

    // Guarda el mensaje enviado en la base de datos
    const business = await Business.findByPk(businessId);
    const businessName = business ? business.name : "empresa";
    const timestamp = Date.now();
    const msgSent = await newMsgSent(
      businessName,
      "Mercado Libre",
      chatId,
      message,
      chatId,
      timestamp,
      businessId,
      false,
      contactId,
      userId
    );
     
    console.log("MELI: Respuesta enviada y guardada correctamente.");
    //creo objeto para emitir a app
    return {
      success: true,
      message: "MERCADO LIBRE: Respuesta enviada correctamente",
      msgSent,
    };
  } catch (error) {
    console.error(
      "MELI-RESPUESTA:Error al enviar mensaje de MERCADO LIBRE:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      message: "MERCADO LIBRE: Error al enviar y guardar la respuesta manual",
    };
  }
};

module.exports = { mercadoLibreSendMessage };
