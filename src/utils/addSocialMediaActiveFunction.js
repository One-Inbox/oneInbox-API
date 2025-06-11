const { SocialMediaActive, Business, SocialMedia } = require("../db");
const addSocialMediaActiveFunction = async (
  dataUser,
  active,
  socialMediaId,
  accessToken,
  refreshToken,
  authorizationCode,
  businessId,
  expirationDate,
  userId
) => {
  try {
    // Crear o buscar la red social activa
    const newSocialMediaActive = await SocialMediaActive.create({
      dataUser,
      active,
      socialMediaId,
      userId,
      accessToken,
      refreshToken,
      authorizationCode,
      expirationDate,
    });

    // Buscar el negocio y la red social
    const business = await Business.findOne({ where: { id: businessId } });
    const socialMedia = await SocialMedia.findByPk(socialMediaId);
    if (business) {
      await newSocialMediaActive.addBusiness(business);
    } else {
      console.warn(`No se encontró el negocio con ID ${businessId}`);
    }
    if (socialMedia) {
      await newSocialMediaActive.addSocialMedia(socialMedia);
    } else {
      console.warn(`No se encontró la red social con ID ${socialMediaId}`);
    }

    // Confirmar asociaciones
    const associatedBusinesses = await newSocialMediaActive.getBusinesses();
    console.log(
      "Negocios asociados después de la inserción:",
      associatedBusinesses.map((b) => b.id)
    );

    // Retornar la red social activa creada o encontrada
    return newSocialMediaActive;
  } catch (error) {
    console.error("Error en addSocialMediaActive:", error.message);
    throw new Error("No se pudo agregar la red social activa");
  }
};
module.exports = { addSocialMediaActiveFunction };
