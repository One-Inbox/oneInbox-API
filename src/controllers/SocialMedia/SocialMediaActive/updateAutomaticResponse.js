const { SocialMediaActive } = require("../../../db");
const updateAutomaticResponse = async (id, automaticResponse) => {
  try {
    if (!id) throw new Error("Missing Id");
    if (!automaticResponse || !Array.isArray(automaticResponse)) {
      throw new Error("Invalid or missing detail array");
    }
    const socialMediaToUpdate = await SocialMediaActive.findByPk(id);
    if (!socialMediaToUpdate) {
      throw new Error(`Social Media with Id ${id} not found`);
    }
    // Obtenemos lo que ya está en la BD
    const currentDetail = socialMediaToUpdate.automaticResponse?.detail || [];

    // Reemplazamos solo los días que vienen del front
    const updatedDetail = currentDetail.map((dayObj) => {
      const found = automaticResponse.find(
        (newObj) => Number(newObj.day) === Number(dayObj.day)
      );
      return found ? { ...dayObj, ...found } : dayObj;
    });
    socialMediaToUpdate.automaticResponse = {
      ...socialMediaToUpdate.automaticResponse,
      active: true,
      detail: updatedDetail,
    };
    await socialMediaToUpdate.save();
    return `Congratulation! Social Media with ID ${id} has been updated`;
  } catch (error) {
    throw error;
  }
};
module.exports = { updateAutomaticResponse };
