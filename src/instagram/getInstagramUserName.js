const axios = require("axios");
const { SocialMediaActive } = require("../db");

const socialMediaId = 3; // ID de Instagram
const getInstagramUserName = async (senderId, businessId) => {
  try {
    const socialMedia = await SocialMediaActive.findOne({
      where: { socialMediaId, businessId },
    });

    if (!socialMedia) {
      throw new Error("Social media not found");
    }

    const accessToken = socialMedia.accessToken;

    const response = await axios.get(
      `https://graph.facebook.com/v16.0/${senderId}?fields=name&access_token=${accessToken}`
    );

    if (response.data && response.data.name) {
      return response.data.name;
    } else {
      throw new Error("No name found in the response");
    }
  } catch (error) {
    console.error("Error fetching Instagram username:", error.message);
    return null;
  }
};
module.exports = { getInstagramUserName };
