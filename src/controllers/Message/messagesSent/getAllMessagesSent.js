const {MsgSent, Business, Contacts, User} = require('../../../db');

const getAllMessagesSent = async () => {
    const messages = await MsgSent.findAll({
        order: [['timestamp']],
      include: [
        {
          model: Business,
          attributes: ['id', 'name'],
        },
        {
          model: Contacts,
          attributes: ['id', 'name', 'phone', 'userName', 'Email'],
        }, 
        {
          model: User,
          attributes: ['id', 'name']
        }, 
      ],
    })
    if (!messages) throw new Error('Messages Sent not found');
    return messages;
};

module.exports = {getAllMessagesSent};