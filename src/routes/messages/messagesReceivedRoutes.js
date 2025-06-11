const { Router } = require("express");
const {
  getAllMessagesReceivedHandler,
} = require("../../handlers/Message/messagesReceived/getAllMessagesReceivedHandler");
const {
  getMessageReceivedByIdHandler,
} = require("../../handlers/Message/messagesReceived/getMessageReceivedByIdHandler");
const {
  updateStateToReadMessageReceivedHandler,
} = require("../../handlers/Message/messagesReceived/updateStatetoReadMessageReceivedHandler");
const {
  updateStateToAnsweredMessageReceivedHandler,
} = require("../../handlers/Message/messagesReceived/updateStateToAnsweredMessageReceivedHandler");
const {
  getMessagesReceivedUnrespondedByContactHandler,
} = require("../../handlers/Message/messagesReceived/getMessagesReceivedUnrespondedByContactHandler");
const {
  deleteMsgReceivedHandler,
} = require("../../handlers/Message/messagesReceived/deleteMsgRecievedHandler");
const {
  deleteAllMsgReceivedHandler,
} = require("../../handlers/Message/messagesReceived/deleteAllMsgReceivedHandler");

const messagesReceivedRoute = Router();

messagesReceivedRoute.get("/", getAllMessagesReceivedHandler);
messagesReceivedRoute.get("/:id", getMessageReceivedByIdHandler);
messagesReceivedRoute.put(
  "/state/read/:id",
  updateStateToReadMessageReceivedHandler
);
messagesReceivedRoute.put(
  "/state/answered/:id",
  updateStateToAnsweredMessageReceivedHandler
);
messagesReceivedRoute.get(
  "/unresponded/:contactId",
  getMessagesReceivedUnrespondedByContactHandler
);
messagesReceivedRoute.delete("/delete/:id", deleteMsgReceivedHandler);
// messagesReceivedRoute.delete("/delete", deleteAllMsgReceivedHandler);

module.exports = { messagesReceivedRoute };
