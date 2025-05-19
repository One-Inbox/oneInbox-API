// const { MsgReceived } = require('../../../db');

// const updateActiveMessageReceived = async (id) => {
//     if(!id) throw new Error('Missing ID')
//     const message = await MsgReceived.findByPk(id);
//     if(!message) {
//         throw new Error (`Messages Received  with Id ${id} not found`);
//     } else {
//         message.active = !message.active
//         await message.save();
//         return(`Congratulation! The attribute active from Message Received with ID ${id} has been update to ${message.active}`)
//     }   
// };

// module.exports = {updateActiveMessageReceived};