const { SocialMediaActive } = require("../db");

//hay que encontrar la manera de obtener el accessToken sin hardcodear el userId
// de momento lo dejo así, pero luego hay que cambiarlo

const getAccessTokenFromDB = async () => {
  try {
    const socialMediaData = await SocialMediaActive.findOne({
      where: { userId: "1043390502" },
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
