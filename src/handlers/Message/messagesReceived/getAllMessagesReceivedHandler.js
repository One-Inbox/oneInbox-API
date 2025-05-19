const {getAllMessagesReceived} = require('../../../controllers/Message/messagesReceived/getAllMessagesReceived')

const getAllMessagesReceivedHandler = async(req, res) => {
    try {
        const allMessages = await getAllMessagesReceived()
        !allMessages.length ? res.status(400).send('Messages not found') : res.status(200).json(allMessages)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getAllMessagesReceivedHandler};