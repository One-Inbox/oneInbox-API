const {SocialMedia} = require('../../../db');

    //const addSocialMedia = async (name, icon, socialMediaActiveId, contactId ) => {
    const addSocialMedia = async (name, socialMediaActiveId, contactId ) => {
        const [newSocialMedia, created] = await SocialMedia.findOrCreate({
            where: {
                name, 
                // icon,
            }
        })
        await newSocialMedia.addSocialMediaActive(socialMediaActiveId);
        await newSocialMedia.addContact(contactId);
  
        return newSocialMedia;
    }



module.exports = {
    addSocialMedia
}