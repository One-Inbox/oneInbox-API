const { MsgReceived } = require("../../../db");
const {Op} = require('sequelize');

const getMessagesReceivedUnrespondedByContact = async (contactId) => {const messages = await MsgReceived.findAll(
    {where:{
        ContactId: contactId,  
        state: {
            [Op.or]: ['No Leidos', 'Leidos']
        }
    }});
    if (!messages) throw new Error('Messages Received not found');
    return messages;
    
};

module.exports = {getMessagesReceivedUnrespondedByContact};