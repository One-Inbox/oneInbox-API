const { Router } = require("express");
const {
  getAllMessagesSentHandler,
} = require("../../handlers/Message/messagesSent/getAllMessagesSentHandler");

const messagesSentRoute = Router();

messagesSentRoute.get("/", getAllMessagesSentHandler);
messagesSentRoute.delete("/:id", deleteMsgSentHandler);

module.exports = { messagesSentRoute };
