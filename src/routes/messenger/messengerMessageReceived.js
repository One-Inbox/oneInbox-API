const { Router } = require('express');
const messengerMsgReceived = Router();

messengerMsgReceived.post('/messengerWebhook/messageReceived', (req, res) => {
    const body = req.body;
  
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        const webhookEvent = entry.messaging[0];
        console.log('Mensaje recibido:', webhookEvent);
  
        // Extrae la información relevante
        const senderId = webhookEvent.sender.id;
        const messageText = webhookEvent.message ? webhookEvent.message.text : null;
  
        if (messageText) {
          console.log(`Mensaje de ${senderId}: ${messageText}`);
  
          //  almacenar el mensaje en la base de datos
          // await MsgReceived.create({ senderId, messageText, platform: 'facebook_messenger' });
  
          // Responder automáticamente o procesar el mensaje
          // await sendMessageToUser(senderId, 'Gracias por tu mensaje!');
        }
      });
  
      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  });
  
  module.exports = messengerMsgReceived