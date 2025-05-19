const {SocialMedia} = require('../../../db');

const getAllSocialMedia = async () => {
  const allSocialMedia = await SocialMedia.findAll(
    { order: [
      ['name'],
  ], 
}
  );
  if(!allSocialMedia)  throw new Error ('Social Media not found');
  return allSocialMedia;
};

module.exports = {getAllSocialMedia};