const {updateStateToReadMessageReceived} = require('../../../controllers/Message/messagesReceived/updateStateToReadMessageReceived')

const updateStateToReadMessageReceivedHandler = async (req, res) => {
    const {id} = req.params
    
    try {
        if(!id) throw new Error('Missing Data');
        const response = await updateStateToReadMessageReceived(id);
        return res.status(200).json(response);    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {updateStateToReadMessageReceivedHandler};