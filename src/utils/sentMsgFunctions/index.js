const { telegramSendMessage } = require("./telegramSendMessage");
const { whatsappSendMessage } = require("./whatsappSendMessage");
const {facebookSendMessage} = require("./facebookSendMessage");
const {instagramSendMessage  } = require("./instagramSendMessage");
const {mercadoLibreSendMessage} = require("./mercadoLibreSendMessage");
module.exports = {telegramSendMessage,  whatsappSendMessage,  facebookSendMessage, instagramSendMessage ,   mercadoLibreSendMessage}
