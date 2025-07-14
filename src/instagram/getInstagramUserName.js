const axios = require("axios");
const { SocialMediaActive, Business } = require("../db");

const socialMediaId = 3; // ID de Instagram
const getInstagramUserName = async (senderId, businessId) => {
  try {
    const socialMedia = await SocialMediaActive.findOne({
      where: { socialMediaId },
      include: [
        {
          model: Business,
          where: { id: businessId },
          through: { attributes: [] }, //excluyo los atributos de la tabla intermedia
        },
      ],
    });

    if (!socialMedia) {
      throw new Error("Social media not found");
    }

    const accessToken = socialMedia.accessToken;

    const url = `https://graph.instagram.com/${senderId}?fields=username&access_token=${accessToken}`;
    console.log("URL completa:", url);
    console.log("Sender ID:", senderId);
    console.log(
      "Access Token (primeros 20 chars):",
      accessToken?.substring(0, 20)
    );

    const response = await axios.get(url);

    // const response = await axios.get(
    //   //`https://graph.facebook.com/v16.0/${senderId}?fields=name&access_token=${accessToken}`
    //   `https://graph.instagram.com/${senderId}&access_token=${accessToken}`
    // );
    return console.log("RECEPCION DESDE ENDPOINT NUEVO:", response.data);

    // if (response.data && response.data.name) {
    //   return response.data.name;
    // } else {
    //   throw new Error("No name found in the response");
    // }
  } catch (error) {
    console.error(
      "IG: error encontrando el nombre del usuario:",
      error.message
    );
    if (error.response) {
      console.log("Error response data:", error.response.data);
      console.log("Error response status:", error.response.status);
    }
    return null;
  }
};
module.exports = { getInstagramUserName };
