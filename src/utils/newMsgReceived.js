const { MsgReceived, Business, Contacts, SocialMedia } = require("../db");

const newMsgReceived = async (
  chatId,
  idUser,
  text,
  name,
  timestamp,
  externalId,
  phoneNumber,
  businessId,
  state,
  received,
  userName,
  processed,
  idSeller,
  idBuyer,
  contact,
  socialMediaId
) => {
  const [msgReceived, created] = await MsgReceived.findOrCreate({
    where: { chatId, externalId },
    defaults: {
      chatId,
      idUser,
      text,
      name,
      timestamp,
      externalId, // Item agregado: Este campo puede ser opcional
      phoneNumber,
      BusinessId: businessId,
      state,
      received,
      userName,
      processed,
      idSeller,
      idBuyer,
    },
  });

  if (!created) {
    await msgReceived.update({
      text,
      name,
      timestamp,
      state,
      received,
      userName,
      processed,
      idSeller,
      idBuyer,
    });
    await msgReceived.update({ processed: true });
  }

  if (!msgReceived.ContactId && contact) {
    await msgReceived.setContact(contact);
  }

  if (socialMediaId && !msgReceived.SocialMediumId) {
    const socialMedia = await SocialMedia.findByPk(socialMediaId);
    if (!socialMedia) throw new Error("PREGUNTA: Social Media no encontrado");
    await msgReceived.setSocialMedium(socialMedia);
  }
  if (created) {
    if (businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error("PREGUNTA: Business no encontrado");
      await msgReceived.setBusiness(business);
    }

    if (contact) await msgReceived.setContact(contact);
    if (!contact) throw new Error("PREGUNTA: Contacto no encontrado");

    if (socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error("PREGUNTA: Social Media no encontrado");
      await msgReceived.setSocialMedium(socialMedia);
    }

    await msgReceived.update({ processed: true }); // Cambia processed a true después de crear el mensaje
  }

  return msgReceived;
};

module.exports = { newMsgReceived };
