const { SocialMediaActive, Business, SocialMedia } = require("../../db");

const searchSocialMediaActive = async (businessId, socialMediaId) => {
  const socialMediaActive = await SocialMediaActive.findOne({
    where: { active: true },
    include: [
      {
        model: Business,
        where: { id: businessId }, // Filtra por businessId
        through: { attributes: [] }, // para no traer datos de la tabla intermedia
      },
      {
        model: SocialMedia,
        where: { id: socialMediaId }, // Filtra por socialMediaId
        through: { attributes: [] },
      },
    ],
  });
  return socialMediaActive;
};
module.exports = { searchSocialMediaActive };
