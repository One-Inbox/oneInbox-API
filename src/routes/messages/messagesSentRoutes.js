const { Router } = require("express");
const {
  getAllMessagesSentHandler,
} = require("../../handlers/Message/messagesSent/getAllMessagesSentHandler");
const {
  deleteMsgSentHandler,
} = require("../../handlers/Message/messagesSent/deleteMsgSentHandler");

const messagesSentRoute = Router();

messagesSentRoute.get("/", getAllMessagesSentHandler);
messagesSentRoute.delete("/:id", deleteMsgSentHandler);

module.exports = { messagesSentRoute };
