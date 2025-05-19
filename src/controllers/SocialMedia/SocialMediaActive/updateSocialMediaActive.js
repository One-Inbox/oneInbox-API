const {SocialMediaActive} =require('../../../db')
const updateSocialMediaActive = async(id, dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, expirationDate, userId) => {
    try {
       if(!id) throw new Error('Missing ID');
       const socialMediaToUpdate = await SocialMediaActive.findByPk(id) 
    
    if(!socialMediaToUpdate) {
        throw new Error(`Social Media with Id ${id} not found`)
    } else {
        socialMediaToUpdate.dataUser = dataUser;
        socialMediaToUpdate.active = active;
        socialMediaToUpdate.socialMediaId = socialMediaId;
        socialMediaToUpdate.accessToken = accessToken;
        socialMediaToUpdate.refreshToken = refreshToken;
        socialMediaToUpdate.authorizationCode = authorizationCode;
        socialMediaToUpdate.expirationDate = expirationDate;
        socialMediaToUpdate.userId = userId;
        
        await socialMediaToUpdate.save();
        return `Congratulation! Social Media with ID ${id} has been updated`;
    }
    } catch (error) {
       throw error
        
    }
}

module.exports = {updateSocialMediaActive}