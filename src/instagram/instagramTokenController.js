const axios = require("axios");
const { SocialMediaActive } = require("../db");

require("dotenv").config();


async function getLongLivedToken(shortLivedToken, userId) {
  try {
    const response = await axios.get("https://graph.instagram.com/access_token", {
      params: {
        grant_type: "ig_exchange_token",
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        access_token: shortLivedToken,
      },
    });

    const { access_token: longLivedToken, expires_in } = response.data;
    const expirationDate = new Date(Date.now() + expires_in * 1000);

    // Actualizar en la base de datos
    const socialMediaActive = await SocialMediaActive.findOne({ 
        where: { socialMediaId: 3, userId: userId },
    });

    if (socialMediaActive) {
      socialMediaActive.accessToken = longLivedToken;
      socialMediaActive.expirationDate = expirationDate;
      await socialMediaActive.save();
      console.log("Token de larga duración guardado en la base de datos.");
    } else {
      console.error("No se encontró el registro en la base de datos.");
    }

    return longLivedToken;
  } catch (error) {
    console.error("Error al obtener el token de larga duración:", error.response?.data || error.message);
    throw new Error(`Error al obtener el token de larga duración: ${error.message}`);
}
}


async function refreshLongLivedToken(longLivedToken, userId) {
  try {
    const response = await axios.get("https://graph.instagram.com/refresh_access_token", {
      params: {
        grant_type: "ig_refresh_token",
        access_token: longLivedToken,
      },
    });

    const { access_token: refreshedToken, expires_in } = response.data;
    const expirationDate = new Date(Date.now() + expires_in * 1000);

    // Actualizar en la base de datos
    const socialMediaActive = await SocialMediaActive.findOne({ 
        where: { socialMediaId: 3, userId: userId },
    });

    if (socialMediaActive) {
      socialMediaActive.refreshToken = refreshedToken;
      socialMediaActive.expirationDate = expirationDate;
      await socialMediaActive.save();
      console.log("Token de larga duración actualizado en la base de datos.");
    } else {
      console.error("No se encontró el registro en la base de datos.");
    }

    return refreshedToken;
  } catch (error) {
    console.error("Error al refrescar el token de larga duración:", error.response?.data || error.message);
    throw new Error("No se pudo refrescar el token de larga duración.");
  }
}

module.exports = {
  getLongLivedToken,
  refreshLongLivedToken,
};
