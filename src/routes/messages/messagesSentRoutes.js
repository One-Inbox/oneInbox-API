const { Router } = require("express");
const {
  getAllMessagesSentHandler,
} = require("../../handlers/Message/messagesSent/getAllMessagesSentHandler");
const {
  deleteMsgSentHandler,
} = require("../../handlers/Message/messagesSent/deleteMsgSentHandler");
const {
  deleteAllMsgSentHandler,
} = require("../../handlers/Message/messagesSent/deleteAllMsgSentHandler");

const messagesSentRoute = Router();

messagesSentRoute.get("/", getAllMessagesSentHandler);
messagesSentRoute.delete("/delete/:id", deleteMsgSentHandler);
messagesSentRoute.delete("/delete/all", deleteAllMsgSentHandler);

module.exports = { messagesSentRoute };
