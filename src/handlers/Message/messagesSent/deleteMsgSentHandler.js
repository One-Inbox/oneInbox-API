const {
  deleteMsgSentById,
} = require("../../.../controllers/Message/messagesSent/deleteMsgSentById");

const deleteSentHandler = async (req, res) => {
  await deleteMsgSentById(req, res);
};

module.exports = {
  deleteSentHandler,
};
