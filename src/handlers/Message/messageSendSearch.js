const messageSendSearchHandler = require('../../controllers/Message/messageSendSearch')


const messageSendSearchController = async (req,res)=>{
    try {
        const {BusinessId, ContactId} = req.query
        const messageSend =  await messageSendSearchHandler({BusinessId,ContactId})
        res.status(200).json(messageSend)    
    } catch (error) {
        res.status(404).json(error.message)
    }
    
}

module.exports=messageSendSearchController