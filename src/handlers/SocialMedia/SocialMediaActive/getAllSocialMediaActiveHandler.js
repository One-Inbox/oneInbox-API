const {getAllSocialMediaActive} = require('../../../controllers/SocialMedia/SocialMediaActive/getAllSocialMediaActive')

const getAllSocialMediaActiveHandler = async(req, res) => {
    try {
        const allSocialMediaActive = await getAllSocialMediaActive()
        !allSocialMediaActive.length ? res.status(400).send('Social Media not found') : res.status(200).json(allSocialMediaActive)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getAllSocialMediaActiveHandler};