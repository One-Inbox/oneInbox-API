const { Contacts, Business, SocialMedia } = require("../db");

const newContactCreated = async(idUser, userName, name, notification, chatId, phone, businessId, socialMediaId) => {
    const [newContact, created] = await Contacts.findOrCreate({
        where: { idUser, userName },
        defaults: { name, notification, chatId, phone,  businessId, SocialMediumId: socialMediaId, userName },
      });
      if(!created) {await newContact.update({ name, notification, chatId, phone });}
      if (created) {
        if (businessId) {
            const business = await Business.findByPk(businessId);
            if (!business) throw new Error("PREGUNTA: Business no encontrado");
            await newContact.addBusiness(business);
        }

        if (socialMediaId) {
            const socialMedia = await SocialMedia.findByPk(socialMediaId);
            if (!socialMedia) throw new Error("PREGUNTA: Social Media no encontrado");
            await newContact.setSocialMedium(socialMedia);
        }
    }

      return newContact
}

module.exports = {newContactCreated}