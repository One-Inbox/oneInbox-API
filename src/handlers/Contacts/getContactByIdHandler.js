const {getContactById} = require('../../controllers/Contacts/getContactById');

const getContactByIdHandler = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) throw new Error('Missing ID');
        const contact = await getContactById(id);
        !contact ? res.status(400).send('contact not found') : res.status(200).json(contact); 
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {getContactByIdHandler};