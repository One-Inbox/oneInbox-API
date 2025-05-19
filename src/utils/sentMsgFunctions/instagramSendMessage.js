const {
  Business,
} = require("../../db");
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
    // // Verificar si existe un mensaje recibido con el mismo idUser
    // const msgReceived = await MsgReceived.findOne({
    //   where: { idUser, SocialMediumId: 3 },
    // });

    // if (!msgReceived) {
    //   throw new Error("No se encontró una conversación activa con el usuario.");
    // }

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

    console.log("Respuesta de Instagram API:", response);
    if (response.status !== 200) {
      console.error('Error en la API de Instagram:', response.data);
      return;}

    // Guardar el mensaje enviado en la base de datos
    const business = await Business.findByPk(businessId);
    const businessName = business ? business.name : "empresa";
    // Generar timestamp
    console.log(' msj enviado instagram', new Date())
    const timestamp = new Date()
    console.log("Tipo de dato de timestamp:", typeof timestamp);
    //const fixedChatId = 'aWdfZAG1faXRlbToxOklHTWVzc2FnZAUlEOjE3ODQxNDY4NjkyNTgwNDgxOjM0MDI4MjM2Njg0MTcxMDMwMTI0NDI1OTczNjMxODA1NTY4Njc3MzozMTk4MjU2Mzk0NTYyODYwNDk1MTI0NTU4NTMxMDAyMzY4MAZDZD'

    console.log(
      "INSTAGRAM: data que se usa para crear el mensaje",
      'chatID',chatId, typeof chatId,
      'businessName', businessName, typeof businessName,
      'mensaje', message, typeof message,
      'fecha', timestamp, typeof timestamp, 
      'empresa', businessId, typeof businessId,
      'contacto', contactId, typeof contactId,
      'usuario que responde', userId, typeof userId,
    );
    
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

    console.log("INSTAGRAM: Respuesta enviada y guardada correctamente.");

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
