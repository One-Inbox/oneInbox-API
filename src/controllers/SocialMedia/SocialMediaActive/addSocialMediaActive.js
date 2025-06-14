//const {addSocialMediaActiveFunction} = require("../../../utils/addSocialMediaActiveFunction")
const { SocialMediaActive, Business, SocialMedia } = require("../../../db");

const addSocialMediaActive = async (
  dataUser,
  active,
  socialMediaId,
  expirationDate,
  accessToken,
  refreshToken,
  authorizationCode,
  businessId,
  userId
) => {
  // console.log("businessId recibido en controller:", businessId);

  try {
    if (!dataUser || !businessId || !socialMediaId)
      throw new Error("Missing Data");
    const expirationDateFormatted =
      expirationDate && !isNaN(Date.parse(expirationDate))
        ? new Date(expirationDate)
        : null;
    const business = await Business.findByPk(businessId);
    const socialMedia = await SocialMedia.findByPk(socialMediaId);

    if (business && socialMedia) {
      const newSocialMediaActive = await SocialMediaActive.create({
        dataUser,
        active,
        socialMediaId,
        expirationDate: expirationDateFormatted,
        accessToken,
        refreshToken,
        authorizationCode,
        userId,
      });
      //console.log('Nueva SocialMediaActive creada:', newSocialMediaActive.id);
      await newSocialMediaActive.addBusiness(business);
      //console.log(`Asociado negocio ${business.id} a SocialMediaActive ${newSocialMediaActive.id}`);
      await newSocialMediaActive.addSocialMedia(socialMedia);
      //console.log(`Asociada red social ${socialMedia.id} a SocialMediaActive ${newSocialMediaActive.id}`);
      // Confirmar asociaciones
      const associatedBusinesses = await newSocialMediaActive.getBusinesses();
      //console.log('Negocios asociados después de la inserción:', associatedBusinesses.map(b => b.id));

      // Retornar la red social activa creada o encontrada
      return newSocialMediaActive;
    } else if (!business && !socialMedia) {
      console.warn("No se encontró el negocio ni red social");
    } else if (!business && socialMedia) {
      console.warn(`No se encontró el negocio con id ${business.id}`);
    } else {
      console.warn(`No se encontró el red social con id ${socialMedia.id}`);
    }
  } catch (error) {
    console.error("Error en addSocialMediaActive:", error.message);
    throw new Error("No se pudo agregar la red social activa");
  }
};

module.exports = {
  addSocialMediaActive,
};
