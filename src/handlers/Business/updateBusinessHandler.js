const {updateBusiness }= require('../../controllers/Business/updateBusiness');

const updateBusinessHandler = async (req, res) => {
    const{ name, password, address, city, country, email, phone} = req.body;
    const {id} = req.params
    try {
        if(!id || !name || !password || !country || !email) throw new Error('Missing Data');
        await updateBusiness(id, name, password, address, city, country, email, phone);
        res.status(200).send('Congratulations! The business has been updated!')    
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
};

module.exports = {updateBusinessHandler};