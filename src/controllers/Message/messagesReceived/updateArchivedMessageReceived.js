const { MsgReceived } = require("../../../db");

// const updateArchivedMessageReceived = async (id) => {
//   if (!id) throw new Error("Missing Id");
//   const message = await MsgReceived.findByPk(id);
//   if (!message) throw new Error(`Messages Received  with Id ${id} not found`);

//   if (!message.archived) {
//     message.archived = true;
//   } else {
//     message.archived = false;
//   }

//   await message.save();

//   return {
//     message,
//     text: `Congratulation! The state from Message Received with ID ${id} has been update to ${
//       message.archived ? "archived" : "not archived"
//     } successfully`,
//   };
// };
// Nuevo controller para manejar toda la conversación
const updateArchivedMessageReceived = async (messageId) => {
  if (!messageId) throw new Error("Missing Message Id");

  // 1️⃣ Obtener el mensaje para conseguir el ContactId
  const message = await MsgReceived.findByPk(messageId);
  if (!message) throw new Error(`Message with Id ${messageId} not found`);

  const contactId = message.ContactId;

  // 2️⃣ Obtener TODOS los mensajes de esa conversación
  const allMessages = await MsgReceived.findAll({
    where: { ContactId: contactId },
  });

  if (allMessages.length === 0) {
    throw new Error(`No messages found for contact ${contactId}`);
  }

  // 3️⃣ Determinar el estado actual de la conversación
  const areAllArchived = allMessages.every((msg) => msg.archived === true);

  // 4️⃣ Cambiar TODOS los mensajes al estado opuesto
  const newArchivedState = !areAllArchived;

  // 5️⃣ Actualizar todos en una transacción
  const updatedMessages = await Promise.all(
    allMessages.map(async (msg) => {
      msg.archived = newArchivedState;
      await msg.save();
      return msg;
    })
  );

  return {
    messages: updatedMessages,
    conversationId: contactId,
    newState: newArchivedState,
    text: `Conversation ${
      newArchivedState ? "archived" : "unarchived"
    } successfully. Updated ${updatedMessages.length} messages.`,
  };
};

module.exports = { updateArchivedMessageReceived };
