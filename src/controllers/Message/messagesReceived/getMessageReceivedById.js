const { MsgReceived, Business, Contacts, SocialMedia } = require('../../../db');

const getMessageReceivedById = async (id) => {
    const messages = await MsgReceived.findByPk(id, {
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
          model: SocialMedia,
          attributes: ['id', 'name']
        }
      ],
    });
    if (!messages) throw new Error('Messages Received not found');
    return messages;
  };
  
  module.exports = { getMessageReceivedById };