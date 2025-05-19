// const {updateActiveMessageReceived} = require('../../../controllers/Message/messagesReceived/updateActiveMessagereceived')

// const updateActiveMessageReceivedHandler = async (req, res) => {
//     const {id} = req.params
//     try {
//         if(!id) throw new Error('Missing Data');
//         await updateActiveMessageReceived(id);
//         res.status(201).send('The message has been updated!')    
//     } catch (error) {
//         res.status(500).json({error: error.message})
//     }
// };

// module.exports = {updateActiveMessageReceivedHandler};
