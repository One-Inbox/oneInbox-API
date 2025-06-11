const {
  deleteMsgSentById,
} = require("../../../controllers/Message/messagesSent/deleteMsgSentById");

const deleteMsgSentHandler = async (req, res) => {
  await deleteMsgSentById(req, res);
};

module.exports = {
  deleteMsgSentHandler,
};
