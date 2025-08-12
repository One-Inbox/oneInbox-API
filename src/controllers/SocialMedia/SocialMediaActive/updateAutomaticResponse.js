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
    } else {
      socialMediaToUpdate.automaticResponse = {
        ...socialMediaToUpdate.automaticResponse,
        active: true,
        detail: automaticResponse,
      };
      await socialMediaToUpdate.save();
      return `Congratulation! Social Media with ID ${id} has been updated`;
    }
  } catch (error) {
    throw error;
  }
};
module.exports = { updateAutomaticResponse };
