const {
    MsgReceived,
    MsgSent,
    Contacts,
    Business,
    User,
  } = require("../db");

const newMsgSent = async (name, app, value, message, chatId, timestamp, businessId, received, contactId, userId) => {
    const msgSent = await MsgSent.create ({
        name, toData: {app, value}, message, chatId, timestamp, BusinessId: businessId, received   
    });

    if(msgSent) {
        if(businessId) {
            const business = await Business.findByPk(businessId);
            if (!business) throw new Error(`msgSent-business: Business with id ${businessId} not found`);
            await msgSent.setBusiness(business);
        };
        const messageR = await MsgReceived.findAll({ where: { chatId } });
        if (!messageR)throw new Error(`msgSent-msgReceived: Message Received with Chatid ${chatId} not found`);
        await msgSent.addMsgReceived(messageR);
        if(contactId) {
            const contactCreated = await Contacts.findByPk(contactId);
            if (!contactCreated) throw new Error(`MsgSent-contact: Contact not found`);
            await msgSent.setContact(contactCreated);    
        }
        if (userId) {
            const user = await User.findByPk(userId);
            if (!user) throw new Error(`msgSent-user: User with id ${userId} not found`);
            await msgSent.setUser(user);
          }
    };
    return msgSent
}

module.exports = {newMsgSent}