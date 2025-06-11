const {
  deleteAllMsgSent,
} = require("../../../controllers/Message/messagesSent/deleteAllMsgSent");

const deleteAllMsgSentHandler = async (req, res) => {
  await deleteAllMsgSent(req, res);
};

module.exports = {
  deleteAllMsgSentHandler,
};
