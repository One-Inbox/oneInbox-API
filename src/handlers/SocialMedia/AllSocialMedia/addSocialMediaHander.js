const {addSocialMedia} = require('../../../controllers/SocialMedia/AllSocialMedia/addSocialMedia')

const addSocialMediaHandler = async (req, res) => {
    //const{name, icon} = req.body;
    const{name} = req.body;
    try {
       // if(!name || !icon ) throw new Error('Missing Data');
        if(!name) throw new Error('Missing Data');
        //const newSocialMedia = await addSocialMedia(name, icon);
        const newSocialMedia = await addSocialMedia(name);
        res.status(201).json(newSocialMedia)    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {addSocialMediaHandler};