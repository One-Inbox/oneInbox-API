const axios = require("axios");

const { newContactCreated } = require("../../utils/newContact");
require("dotenv").config();

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";
const socialMediaId = 5;

const mercadoLibreOrdersController = async (accessToken, idUser) => {
  if (!accessToken || !idUser) throw new Error("Missing data");
  const response = await axios.get(
    `https://api.mercadolibre.com/orders/search?seller=${idUser}&order.status=paid&access_token=${accessToken}`
  );
  if (!response) {
    throw new Error("There is no order with paid status for this user");
  }
  const orders = response.data.results;
  console.log("ordenes: ", orders);

  for (const order of orders) {
    try {
      const orderId = order.id.toString();
      const buyer = order.buyer;
      const userId = buyer.id.toString();
      const userName = buyer.nickname || `Usuario_${userId}`;
      const name = `${buyer.first_name || ""} ${buyer.last_name || ""}`.trim();

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
      if (!responseM) throw new Error("no hay mensajes asociados a esta orden");
      const messages = responseM.data.messages;
      console.log("mensajes: ", messages);
    } catch (error) {
      console.error(`Error procesando orden ${order.id}:`, err.message);
      continue;
    }
  }
};
module.exports = { mercadoLibreOrdersController };
