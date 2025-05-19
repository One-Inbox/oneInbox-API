const { updateUser } = require('../../controllers/User/updateUser');

const updateUserHandler = async (req, res) => {
    //const { name, email, password, phone, privilege, socketId, image, login } = req.body;
    
    const { name, email, password, phone, privilege, socketId, image } = req.body;
    const { id } = req.params;
    
    try {
        if (!id || !name || !email || !password || !phone || !privilege) throw new Error('Missing Data');

        //const result = await updateUser(id, name, email, password, phone, privilege, socketId, image, login);
        const result = await updateUser(id, name, email, password, phone, privilege, socketId, image);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { updateUserHandler };