const {getAllMessagesSent}=require('../../../controllers/Message/messagesSent/getAllMessagesSent')

const getAllMessagesSentHandler = async(req, res) => {
    try {
        const allMessages = await getAllMessagesSent()
        !allMessages.length ? res.status(400).send('Messages not found') : res.status(200).json(allMessages)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getAllMessagesSentHandler};