const { MsgReceived, Business, Contacts, SocialMedia, MsgSent, User } = require('../../../db');

const getAllMessagesReceived = async () => {
    const messages = await MsgReceived.findAll({
      order: [['timestamp']],
      include: [
        {
          model: Business,
          attributes: ['id', 'name'],
        },
        {
          model: Contacts,
          attributes: ['id', 'name', 'phone', 'userName', 'Email'],
          include:[
          {
              model: MsgReceived,
              attributes: ['id', 'timestamp', 'received'],
          },
          {
              model: MsgSent,
              attribute: ['id', 'timestamp', 'received'],
              include: [ 
                {
                      model: User,
                      attributes: ['id', 'name']
                    }, 
                  ],
                }
             ]
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
  
  module.exports = { getAllMessagesReceived };
  