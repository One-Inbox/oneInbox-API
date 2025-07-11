const axios = require("axios");
const {
  MsgReceived,
  Business,
  SocialMedia,
  SocialMediaActive,
} = require("../../db");
const { newContactCreated } = require("../../utils/newContact");
const { newMsgReceived } = require("../../utils/newMsgReceived");
const { postNewMsgReceived } = require("../../utils/postNewMsgReceived");
require("dotenv").config();

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";
const socialMediaId = 5;

const mercadoLibreOrdersController = async (accessToken, idUser) => {
  if (!accessToken || !idUser) throw new Error("Missing data");
  const business = await Business.findByPk(businessId);
  const socialMedia = await SocialMedia.findByPk(socialMediaId);
  const response = await axios.get(
    `https://api.mercadolibre.com/orders/search?seller=${idUser}&order.status=paid&access_token=${accessToken}`
  );
  if (!response.data || response.data.results.length === 0) {
    throw new Error("There is no order with paid status for this user");
  }
  const orders = response.data.results;
  console.log("ordenes: ", orders);

  for (const order of orders) {
    try {
      const orderId = (order.pack_id || order.id).toString();
      const buyer = order.buyer;
      const userId = buyer.id.toString();
      const userName = buyer.nickname || `Usuario_${userId}`;
      const name = buyer.nickname || `Usuario_${userId}`;

      const newContact = await newContactCreated(
        userId,
        userName,
        name,
        true,
        orderId,
        null,
        businessId,
        socialMediaId
      );

      const responseM = await axios.get(
        `https://api.mercadolibre.com/messages/orders/${orderId}?access_token=${accessToken}`
      );
      if (!responseM.data || responseM.data.messages.length === 0)
        throw new Error("no hay mensajes asociados a esta orden");
      const allMessages = responseM.data.messages;
      const messages =
        allMessages &&
        allMessages.filter((message) => message.from.role === "seller");
      if (!messages || messages.length === 0)
        throw new Error("no hay mensajes del vendedor en esta orden");

      console.log("mensajes: ", messages);

      for (const message of messages) {
        const text =
          message.text ||
          message.plain ||
          message.message?.plain ||
          "(Mensaje vacío)";
        const timestamp = new Date(message.date_created).getTime();
        const externalId = `MELI:ORDER-${message.id}` || null;

        const msgReceived = await newMsgReceived(
          orderId,
          userId,
          text,
          name,
          timestamp,
          externalId,
          null,
          businessId,
          "No Leidos",
          true,
          userName,
          false,
          newContact,
          socialMediaId
        );
        // Emito el mensaje a la app
        if (msgReceived.processed) {
          const msgReceivedData = {
            id: msgReceived.id,
            chatId: msgReceived.chatId,
            idUser: msgReceived.userId,
            text: msgReceived.text,
            name: msgReceived.name,
            timestamp: msgReceived.timestamp,
            externalId: msgReceived.externalId, //Item agregado: Este campo puede ser opcional
            phoneNumber: msgReceived.phoneNumber,
            userName: msgReceived.userName,
            BusinessId: businessId,
            Business: { id: businessId, name: business.name },
            state: "No Leidos",
            received: true,
            ContactId: newContact.id,
            Contact: {
              id: newContact.id,
              name: newContact.name,
              userName: newContact.userName,
            },
            SocialMediumId: socialMediaId,
            SocialMedium: {
              id: socialMediaId,
              name: socialMedia.name,
              icon: socialMedia.icon,
            },
          };

          await postNewMsgReceived(msgReceivedData, res);
        }
      }
    } catch (error) {
      console.error("datos asociados al error", {
        orderId: order.id,
        packId: order.pack_id,
        tags: order.tags,
        url: `https://api.mercadolibre.com/messages/orders/${
          order.pack_id || order.id
        }?access_token=${accessToken}`,
        error: error.response?.data || error.message,
      });
      if (error.response?.status === 404) {
        console.warn(`No hay mensajes para la orden ${order.id}`);
      } else {
        console.error(`Error procesando orden ${order.id}:`, error.message);
      }
      continue;
    }
  }
};
module.exports = { mercadoLibreOrdersController };
