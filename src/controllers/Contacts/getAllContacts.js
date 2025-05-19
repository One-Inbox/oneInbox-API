const { Contacts, Business, MsgReceived, MsgSent, SocialMedia } = require('../../db');
const getAllContacts = async () => {
    const contacts = Contacts.findAll(
        { order: [
            ['name'],
        ],
            include:[
              {
                model: Business,
                attributes: ['id', 'name']
            },
            {model: SocialMedia,
                attributes: ['id', 'name']
              },
            {
                model: MsgReceived,
                attributes: ['id', 'chatId', 'text', 'name', 'timestamp', 'phoneNumber', 'userName', 'Email', 'state', 'received'],
            },
            {
                    model: MsgSent,
                    attribute: ['id', 'toData', 'message', 'timestamp', 'received'],
                }
               ]
             })
          
        
          if(!contacts)  throw new Error ('Contacts not found');
          return contacts;
        }
    



module.exports = {getAllContacts}