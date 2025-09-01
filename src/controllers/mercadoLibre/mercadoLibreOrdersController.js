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
const {
  sendAutomaticResponse,
} = require("../../utils/automaticResponse/sendAutomaticResponse");
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

  for (const order of orders) {
    try {
      if (order.shipping && order.shipping.id) {
        const shippingId = order.shipping.id;
        const shippingResponse = await axios.get(
          `https://api.mercadolibre.com/shipments/${shippingId}?access_token=${accessToken}`
        );
        if (
          shippingResponse.data &&
          shippingResponse.data.status === "delivered"
        ) {
          // console.warn(`Orden ${order.id} ha sido entregada`);
          continue; // Skip this order if it has been delivered
        }
      }
      if (
        (order.tags && order.tags.includes("canceled")) ||
        order.tags.includes("delivered")
      ) {
        // console.warn(`Orden ${order.id} ha sido cancelada o entregada`);
        continue; // Skip this order if it has been canceled or delivered
      }
      const orderId = (order.pack_id || order.id).toString();

      const responseM = await axios.get(
        `https://api.mercadolibre.com/messages/orders/${orderId}?access_token=${accessToken}`
      );
      if (!responseM.data || responseM.data.messages.length === 0)
        throw new Error("no hay mensajes asociados a esta orden");
      const allMessages = responseM.data.messages;
      const messages =
        allMessages &&
        allMessages.filter((message) => message.from.role === "buyer");
      if (!messages || messages.length === 0)
        throw new Error("no hay mensajes del comprador en esta orden");

      const product =
        order.order_items.length > 1
          ? `${order.order_items[0].item.title} + otros`
          : order.order_items[0].item.title;

      const buyer = order.buyer;
      const userId = buyer.id.toString();
      const userName =
        `${buyer.nickname} -COMPRA: ${product}` ||
        `Usuario_${userId} -COMPRA: ${product}`;
      const name = userName;

      const idSeller = order.seller.id;
      const idBuyer = buyer.id;

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
          idSeller,
          idBuyer,
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
            idSeller: msgReceived.idSeller,
            idBuyer: msgReceived.idBuyer,
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

          // await postNewMsgReceived(msgReceivedData, res);
          // await sendAutomaticResponse(msgReceivedData);
          try {
            await postNewMsgReceived(msgReceivedData, res);
          } catch (err) {
            console.error("Error al guardar mensaje:", err.message);
          }

          // Intentar enviar respuesta automática siempre
          try {
            await sendAutomaticResponse(msgReceivedData);
          } catch (err) {
            console.error("Error al enviar respuesta automática:", err.message);
          }

          // Responder a Mercado Libre sí o sí
          return res
            .status(200)
            .json({ message: "Evento procesado correctamente" });
        }
      }
    } catch (error) {
      const packOrOrderId = order.pack_id || order.id;
      const isNotFound = error.response?.status === 404;

      if (isNotFound) {
        console.warn(
          `[SIN MENSAJES] No hay mensajes para la orden ${order.id}`
        );
      } else {
        console.error(
          `[ERROR] Falló el procesamiento de la orden ${order.id}:`,
          {
            orderId: order.id,
            packId: order.pack_id,
            tags: order.tags,
            url: `https://api.mercadolibre.com/messages/orders/${packOrOrderId}?access_token=${accessToken}`,
            error: error.response?.data || error.message,
          }
        );
      }

      continue;
    }
  }
};
module.exports = { mercadoLibreOrdersController };
