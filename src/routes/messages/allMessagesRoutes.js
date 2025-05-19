const {Router} = require('express');
const {messagesReceivedRoute} = require('./messagesReceivedRoutes');
const {messagesSentRoute} = require('./messagesSentRoutes');
//const {authenticateBusiness} = require('../../midlewares/authenticateBusiness')

const allMessagesRoute = Router();
//RUTAS PROTEGIDAS
//allMessagesRoute.use('/received', authenticateBusiness, messagesReceivedRoute)
//allMessagesRoute.use('/sent', authenticateBusiness, messagesSentRoute)

//RUTAS SIN PROTECCION
allMessagesRoute.use('/received', messagesReceivedRoute)
allMessagesRoute.use('/sent', messagesSentRoute)

module.exports = {allMessagesRoute};
