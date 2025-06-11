const { MsgReceived } = require("../../../db");

const updateStateToReadMessageReceived = async (id) => {
  if (!id) throw new Error("Missing Id");
  const message = await MsgReceived.findByPk(id);
  if (!message) throw new Error(`Messages Received  with Id ${id} not found`);
  if (message.state !== "No Leidos") {
    return "This message cannot update its status";
  }

  message.state = "Leidos";
  await message.save();
  return {
    message,
    text: `Congratulation! The state from Message Received with ID ${id} has been update to Read`,
  };
};

module.exports = { updateStateToReadMessageReceived };
