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

  // const messageUpdate = {
  //     id: message.id,
  //     chatId: message.chatId,
  //     idUser: message.idUser,
  //     text: message.text,
  //     name: message.name,
  //     timestamp: message.timestamp,
  //     externalId: message.externalId,
  //     phoneNumber: message.phoneNumber,
  //     userName: message.userName,
  //     BusinessId: message.BusinessId,
  //     state: message.state,
  //     received: message.received,
  //     ContactId: message.ContactId,
  //     SocialMediumId: message.SocialMediumId,
  // }

  console.log(message);

  return {
    message,
    text: `Congratulation! The state from Message Received with ID ${id} has been update to Read`,
  };
};

module.exports = { updateStateToReadMessageReceived };
