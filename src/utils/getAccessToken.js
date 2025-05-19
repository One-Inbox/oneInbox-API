const { SocialMediaActive } = require("../db");

const getAccessTokenFromDB = async () => {
  try {
    const socialMediaData = await SocialMediaActive.findOne({
      where: { userId: "232533265" }
    });

    if (socialMediaData) {
      return socialMediaData.accessToken;
    } else {
      throw new Error("No se encontró el accessToken en la base de datos.");
    }
  } catch (error) {
    console.error(
      "Error al obtener el accessToken de la base de datos:",
      error.message
    );
    throw error;
  }
};

module.exports = { getAccessTokenFromDB };
