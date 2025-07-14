const { newMsgReceived } = require("../utils/newMsgReceived");
const { postNewMsgReceived } = require("../utils/postNewMsgReceived");
const { newContactCreated } = require("../utils/newContact");
const { Business, SocialMedia } = require("../db");

const processInstagramMessage = async (instagramMessage) => {
  try {
    // Verificar si el mensaje es un "echo"
    if (instagramMessage.message?.is_echo) {
      return {
        success: false,
        error: "IG: Mensaje filtrado por ser de tipo echo.",
      };
    }
    // Extraer datos ya procesados de instagramWebhook
    const {
      chatId,
      idUser,
      text,
      name,
      timestamp,
      externalId, // Item agregado; Este campo puede ser opcional
      phoneNumber,
      businessId,
      state,
      received,
      userName,
      socialMediaId,
    } = instagramMessage;

    // Validación para asegurar que los datos obligatorios estén presentes
    if (!chatId || !idUser || !text || !timestamp) {
      // console.error(
      //   "ERROR: Faltan datos obligatorios para procesar el mensaje."
      // );
      throw new Error(
        "IG: Faltan datos obligatorios para procesar el mensaje."
      );
    }

    // Procesos de creación/actualización
    const newContact = await newContactCreated(
      idUser,
      userName,
      name,
      true,
      chatId,
      phoneNumber,
      businessId,
      socialMediaId
    );

    // Guardar el mensaje recibido
    const msgReceived = await newMsgReceived(
      chatId,
      idUser,
      text,
      name,
      timestamp,
      externalId, // Item agregado Este campo puede ser opcional
      phoneNumber,
      businessId,
      state,
      received,
      userName,
      false,
      null, // idSeller: item agregado: Este campo puede ser opcional
      null, // idBuyer: item agregado: Este campo puede ser opcional
      newContact,
      socialMediaId
    );

    // Emitir el mensaje a la app
    if (msgReceived.processed) {
      const business = await Business.findByPk(businessId);
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      const msgReceivedData = {
        id: msgReceived.id,
        chatId: msgReceived.chatId,
        idUser: msgReceived.idUser,
        text: msgReceived.text,
        name: msgReceived.idUser,
        timestamp: msgReceived.timestamp,
        externalId: msgReceived.externalId, // Item agregado: Este campo puede ser opcional
        phoneNumber: msgReceived.phoneNumber,
        userName: msgReceived.idUser,
        BusinessId: businessId,
        Business: { id: businessId, name: business.name },
        state: "No Leidos",
        received: true,
        ContactId: newContact.id,
        Contact: {
          id: newContact.id,
          name: newContact.idUser,
          userName: newContact.userName,
        },
        SocialMediumId: socialMediaId,
        SocialMedium: {
          id: socialMediaId,
          name: socialMedia.name,
          icon: socialMedia.icon,
        },
      };

      await postNewMsgReceived(msgReceivedData);
      return { success: true }; // Devolver éxito si todo salió bien
    }

    // Si no se procesó correctamente
    return { success: false, error: "Mensaje no procesado" };
  } catch (error) {
    console.error(
      "INSTAGRAM :Error al al recibir un mensaje de instagram:",
      error.message
    );
    return { success: false, error: error.message }; // Devolver el error si algo falla
  }
};

module.exports = { processInstagramMessage };
