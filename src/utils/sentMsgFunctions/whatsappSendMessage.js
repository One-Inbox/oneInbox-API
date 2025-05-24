require("dotenv").config();
const axios = require("axios");
const { newMsgSent } = require("../newMsgSent");
const { Business } = require("../../db");
const { formatPhone } = require("../formatPhone");

const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API
const BUSINESS_PHONE_NUMBER_ID =
  process.env.BUSINESS_PHONE_NUMBER_ID || 493353500531078;

// async function sendTextMessage() {
//     const response = await axios({
//         url: `https://graph.facebook.com/v20.0/${BUSINESS_PHONE_NUMBER_ID}/messages`,
//         method: 'post',
//         headers: {
//             'Authorization': `Bearer ${GRAPH_API_TOKEN}`,
//             'Content-Type': 'application/json'
//         },
//         data: JSON.stringify({
//             messaging_product: 'whatsapp',
//             to: '54348715347843', //aca iria phone
//             type: 'text',
//             text:{
//                 body: 'Holaaa' //aca iria message
//             }
//         })
//     })

//       console.log(response.data)

// }

// sendTextMessage();

const whatsappSendMessage = async (
  chatId,
  message,
  userId,
  phone,
  businessId,
  contactId
) => {
  // log para checkear que se envien los datos a la api
  console.log("Datos recibidos desde app:", {
    chatId,
    message,
    userId,
    businessId,
    contactId,
    phone,
  });

  if (!chatId || !message || !userId || !phone || !businessId)
    throw new Error("Missing data");

  try {
    const formatedPhone = formatPhone(phone);
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
        to: formatedPhone,
        //to: phone,
        type: "text",
        text: {
          //body: "This is a text message from backend 2",
          body: message,
        },
      }),
    });

    console.log(response.data);

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

    console.log("WhatsApp: Respuesta enviada y guardada correctamente.");
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
      //error.response ? error.response.data : error.message
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
//whatsappSendMessage();
module.exports = { whatsappSendMessage };
