const {getUserById} = require('../../controllers/User/getUserById');

const getUserByIdHandler = async (req, res) => {
    const {id} = req.params;
    try {
        if(!id) throw new Error('Missing ID');
        const user = await getUserById(id);
        !user.name ? res.status(400).send('User not found') : res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {getUserByIdHandler};