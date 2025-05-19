const { getMessagesReceivedUnrespondedByContact } = require('../../../controllers/Message/messagesReceived/getMessagesReceivedUnrespondedByContact');

const getMessagesReceivedUnrespondedByContactHandler = async(req, res) => {
    const {contactId} = req.params;
    
    try {
        if(!contactId) throw new Error('Missing Id by Contact');
        const messages = await getMessagesReceivedUnrespondedByContact(contactId);
        !messages ? res.status(400).send('Message not found') : res.status(200).json(messages); 
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getMessagesReceivedUnrespondedByContactHandler};