const {
  deleteAllMsgReceived,
} = require("../../../controllers/Message/messagesReceived/deleteAllMsgReceived");

const deleteAllMsgReceivedHandler = async (req, res) => {
  await deleteAllMsgReceived(req, res);
};

module.exports = {
  deleteAllMsgReceivedHandler,
};
