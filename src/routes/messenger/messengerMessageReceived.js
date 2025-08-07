const { Router } = require("express");
const messengerMsgReceived = Router();

messengerMsgReceived.post("/messengerWebhook/messageReceived", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      // console.log("Mensaje recibido:", webhookEvent);

      // Extrae la información relevante
      const senderId = webhookEvent.sender.id;
      const messageText = webhookEvent.message
        ? webhookEvent.message.text
        : null;

      if (messageText) {
        console.log(`Mensaje de ${senderId}: ${messageText}`);
        // Aquí puedes procesar el mensaje recibido, por ejemplo, guardarlo en la base de datos
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

module.exports = messengerMsgReceived;
