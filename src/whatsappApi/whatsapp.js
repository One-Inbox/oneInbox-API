const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");
const axios = require('axios');
require("dotenv").config();
const { newContactCreated } = require("../utils/newContact");
const { newMsgReceived } = require("../utils/newMsgReceived");
const { postNewMsgReceived } = require("../utils/postNewMsgReceived");


const businessId = "c3ea9d75-db7c-4dda-bca5-232d4a2b2ba1"; 
const socialMediaId = 2; // Este es el id de WhatsApp en SocialMedia
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API

const BUSINESS_PHONE_NUMBER_ID  = process.env.BUSINESS_PHONE_NUMBER_ID || 493353500531078;


const handleMessage = async (messageAllData) => {
    const msg = messageAllData.messages[0];
    console.log('datos mensaje: ', msg);
    const dataContact = messageAllData.contacts[0]
    console.log('datos contacto: ', dataContact);

      const chatId = msg.id  //deberia se  msg.id, pero hayque cambiar el modelo contacto, ya que es un string y no un numero(bigInt)
      const message = msg.text.body;
      const senderPhoneNumber= msg.from;
      const senderUserId = dataContact.wa_id ? dataContact.wa_id : chatId 
      const senderName = dataContact.profile ? dataContact.profile.name : senderPhoneNumber ? senderPhoneNumber : 'Usuario'
 
  
  try {    
  // Buscar o crear el contacto
    const newContact = await newContactCreated(senderUserId, null, senderName, true, chatId, senderPhoneNumber, businessId, socialMediaId)
  
  // Crear el mensaje recibido
    const timestamp = Date.now()
    const msgReceived = await newMsgReceived(chatId, senderUserId, message, senderName, timestamp,  senderPhoneNumber, businessId, "No Leidos", true, null, false, newContact, socialMediaId)
    console.log("WHATSAPP-PREGUNTA: mensaje recibido guardado en la base de datos:");
    
  //emitir mensaje a app 
    if(msgReceived.processed) {
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
        phoneNumber: msgReceived.phoneNumber,
        userName: msgReceived.userName,
        BusinessId: businessId,
        Business: {id: business.id, name: business.name},
        state: "No Leidos",
        received: true,
        ContactId: newContact.id,
        Contact: {id: newContact.id, name: newContact.name, phone: newContact.phone,},
        SocialMediumId: socialMediaId,
        SocialMedium: {id: socialMediaId, name: socialMedia.name? socialMedia.name : socialMediaData.name, icon: socialMedia.icon ? socialMedia.icon : socialMediaData.icon}
      };
      console.log('WHATSAPP-PREGUNTA: creo la data para emitir');
      await postNewMsgReceived( msgReceivedData, null)
      console.log('WHATSAPP-PREGUNTA: emito el mensaje recibido a app');
    }

  } catch (error) {
    console.error("WHATSAPP-PREGUNTA: Error al guardar el mensaje de WhatsApp recibido en la base de datos:", error);
  }
};

module.exports = { handleMessage };

