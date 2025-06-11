const { Router } = require("express");
const {
  getAllMessagesReceivedHandler,
} = require("../../handlers/Message/messagesReceived/getAllMessagesReceivedHandler");
// const {getAllMessagesReceivedByContactHandler} = require('../../handlers/message/messagesReceived/getAllMessagesReceivedByContactHandler');
const {
  getMessageReceivedByIdHandler,
} = require("../../handlers/Message/messagesReceived/getMessageReceivedByIdHandler");
const {
  updateStateToReadMessageReceivedHandler,
} = require("../../handlers/Message/messagesReceived/updateStatetoReadMessageReceivedHandler");
const {
  updateStateToAnsweredMessageReceivedHandler,
} = require("../../handlers/Message/messagesReceived/updateStateToAnsweredMessageReceivedHandler");
// const {updateFileMessageReceivedHandler} = require('../../handlers/message/messagesReceived/updateFileMessageReceivedHandler')
//const {updateActiveMessageReceivedHandler} = require('../../handlers/Message/messagesReceived/updateActiveMessageReceivedHandler')
const {
  getMessagesReceivedUnrespondedByContactHandler,
} = require("../../handlers/Message/messagesReceived/getMessagesReceivedUnrespondedByContactHandler");
const {
  deleteMsgReceivedHandler,
} = require("../../handlers/Message/messagesReceived/deleteMsgReceivedHandler");

const messagesReceivedRoute = Router();

messagesReceivedRoute.get("/", getAllMessagesReceivedHandler);
// messagesReceivedRoute.get('byContact/:id', getAllMessagesReceivedByContactHandler);
messagesReceivedRoute.get("/:id", getMessageReceivedByIdHandler);
messagesReceivedRoute.put(
  "/state/read/:id",
  updateStateToReadMessageReceivedHandler
);
messagesReceivedRoute.put(
  "/state/answered/:id",
  updateStateToAnsweredMessageReceivedHandler
);
// messagesReceivedRoute.put('/file/:id', updateFileMessageReceivedHandler);
//messagesReceivedRoute.put('/active/:id', updateActiveMessageReceivedHandler);
messagesReceivedRoute.get(
  "/unresponded/:contactId",
  getMessagesReceivedUnrespondedByContactHandler
);
messagesReceivedRoute.delete("/:id", deleteMsgReceivedHandler);

module.exports = { messagesReceivedRoute };
