const {
  updateArchivedMessageReceived,
} = require("../../../controllers/Message/messagesReceived/updateArchivedMessageReceived.js");

const updateArchivedMessageReceivedHandler = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("Missing Data");
    const response = await updateArchivedMessageReceived(id);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateArchivedMessageReceivedHandler };
