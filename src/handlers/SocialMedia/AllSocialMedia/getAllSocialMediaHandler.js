const {getAllSocialMedia} = require('../../../controllers/SocialMedia/AllSocialMedia/getAllSocialMedia')

const getAllSocialMediaHandler = async(req, res) => {
    try {
        const allSocialMedia = await getAllSocialMedia()
        !allSocialMedia.length ? res.status(400).send('Social Media not found') : res.status(200).json(allSocialMedia)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getAllSocialMediaHandler};