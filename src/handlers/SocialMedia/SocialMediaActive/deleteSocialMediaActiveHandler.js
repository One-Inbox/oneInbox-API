const { deleteSocialMediaActiveById } = require('../../../controllers/SocialMedia/SocialMediaActive/deleteSocialMediaActive');

const deleteSocialMediaActiveHandler = async (req, res) => {
  await deleteSocialMediaActiveById(req, res);
};

module.exports = {
  deleteSocialMediaActiveHandler,
};
