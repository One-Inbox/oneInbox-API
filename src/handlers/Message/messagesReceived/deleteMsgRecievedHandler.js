const {
  deleteMsgReceivedById,
} = require("../../../controllers/Message/messagesReceived/deleteMessageReceivedById");

const deleteMsgReceivedHandler = async (req, res) => {
  await deleteMsgReceivedById(req, res);
};

module.exports = {
  deleteMsgReceivedHandler,
};
