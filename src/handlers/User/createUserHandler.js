const {createUser} = require('../../controllers/User/createUser')

const createUserHandler = async (req, res) => {
    //const{name, email, password, phone, privilege, socketId, image, login, businessId} = req.body;
    const{name, email, password, phone, privilege, socketId, image, businessId} = req.body;
    try {
        if(!name || !email || !password || !phone || !privilege || !businessId) throw new Error('Missing Data');

        const newUser = await createUser(
            name,
            email,
            password,
            phone,
            privilege,
            socketId ? socketId : null,
            image ? image : null,
            // login,
            businessId,

        );
        res.status(201).json(newUser)    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {createUserHandler};