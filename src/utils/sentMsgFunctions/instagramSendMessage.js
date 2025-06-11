const { Business } = require("../../db");
const { newMsgSent } = require("../newMsgSent");
const axios = require("axios");
require("dotenv").config();

const instagramSendMessage = async (
  chatId,
  message,
  userId,
  businessId,
  contactId,
  idUser
) => {
  if (!chatId || !message || !userId || !businessId || !idUser)
    throw new Error("Missing data");
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const body = {
      recipient: { id: idUser },
      message: { text: message },
    };

    const response = await axios.post(
      "https://graph.instagram.com/v21.0/me/messages",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status !== 200) {
      console.error("Error en la API de Instagram:", response.data);
      return;
    }

    // Guardar el mensaje enviado en la base de datos
    const business = await Business.findByPk(businessId);
    const businessName = business ? business.name : "empresa";
    const timestamp = new Date();

    const msgSent = await newMsgSent(
      businessName,
      "Instagram",
      chatId,
      message,
      chatId,
      timestamp,
      businessId,
      false,
      contactId,
      userId
    );

    // Crear el objeto para emitir a la app
    return {
      success: true,
      message: "INSTAGRAM: Respuesta enviada correctamente",
      msgSent,
    };
  } catch (error) {
    console.error(
      "Error al enviar mensaje de INSTAGRAM:",
      error.response ? error.response.data : error.message
    );
    return {
      success: false,
      message: "INSTAGRAM: Error al enviar y guardar la respuesta manual",
    };
  }
};

module.exports = { instagramSendMessage };
