const { MsgReceived } = require("../../../db");

const updateArchivedMessageReceived = async (id) => {
  if (!id) throw new Error("Missing Id");
  const message = await MsgReceived.findByPk(id);
  if (!message) throw new Error(`Messages Received  with Id ${id} not found`);

  if (!message.archived) {
    message.archived = true;
  } else {
    message.archived = false;
  }

  await message.save();

  return {
    message,
    text: `Congratulation! The state from Message Received with ID ${id} has been update to ${
      message.archived ? "archived" : "not archived"
    } successfully`,
  };
};

module.exports = { updateArchivedMessageReceived };
