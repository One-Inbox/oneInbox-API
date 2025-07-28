const axios = require("axios");
const { newMsgSent } = require("../newMsgSent");
const { Business, MsgSent, MsgReceived } = require("../../db");

const mercadoLibreSendMessage = async (
  chatId,
  message,
  userId,
  accessToken,
  businessId,
  contactId,
  idSeller,
  idBuyer
) => {
  if (!chatId || !message || !userId || !accessToken || !businessId)
    throw new Error("Missing data");
  try {
    const originMessage = idSeller || idBuyer ? "orders" : "questions";

    if (originMessage === "orders") {
      console.log(
        "estoy respondiendo a un mensaje de Meli de un articulo comprado"
      );
      const response = await axios.post(
        `https://api.mercadolibre.com/messages/orders/${chatId}/messages?access_token=${accessToken}`,
        {
          from: { user_id: idSeller },
          to: { user_id: idBuyer },
          text: { plain: message },
        }
      );
    } else {
      console.log("estoy respondiendo a una pregunta de Meli");
      const response = await axios.post(
        `https://api.mercadolibre.com/answers?access_token=${accessToken}`,
        {
          question_id: chatId,
          text: message,
        }
      );
    }

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
