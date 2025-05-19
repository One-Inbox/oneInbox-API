const { User } = require('../../db');

//const updateUser = async (id, name, email, password, phone, privilege, socketId, image, login) => {
const updateUser = async (id, name, email, password, phone, privilege, socketId, image) => {   
    try {
        if (!id) throw new Error('Missing ID');
        const userToUpdate = await User.findByPk(id);
        
        if (!userToUpdate) {
            throw new Error(`User with Id ${id} not found`);
        } else {
            userToUpdate.name = name;
            userToUpdate.email = email;
            userToUpdate.password = password;
            userToUpdate.phone = phone;
            userToUpdate.privilege = privilege;
            userToUpdate.socketId = socketId || null;
            userToUpdate.image = image || null;
            // userToUpdate.login = login || false;
            
            await userToUpdate.save();
            return `Congratulation! User with ID ${id} has been updated`;
        }
    } catch (error) {
        throw error; 
    }
};

module.exports = { updateUser };