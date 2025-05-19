const {addSocialMediaActive} = require('../../../controllers/SocialMedia/SocialMediaActive/addSocialMediaActive')

const addSocialMediaActiveHandler = async (req, res) => {
    
    const{dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, businessId, expirationDate, userId} = req.body;
    console.log('data', req.body);
    console.log('businessId recibido en handler:', businessId);
    
    try {
        if(!dataUser || !active || !businessId || !socialMediaId) throw new Error('Missing Data');
        const newSocialMediaActive = await addSocialMediaActive(dataUser, active, socialMediaId, expirationDate, accessToken, refreshToken, authorizationCode, businessId, userId);
        res.status(201).json(newSocialMediaActive)    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {addSocialMediaActiveHandler};