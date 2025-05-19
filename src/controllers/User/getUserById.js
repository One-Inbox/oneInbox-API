const {Business, User, MsgSent } = require('../../db')

const getUserById = async (id) => {

        const user = await User.findByPk(id, {
            include:[
                {
                    model: Business,
                    attributes: ['id', 'name']
                },
                {
                    model: MsgSent,
                    attributes: ['id', 'toData', 'message', 'timestamp', 'received'],
                }
        ]});
    if(!user) throw new Error (`User with ID ${id} not found`);
    
    return user;
};  

module.exports = {getUserById};