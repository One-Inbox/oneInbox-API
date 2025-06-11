const { Router } = require("express");
const businessRoute = require("./businessRoutes");
const userRoute = require("./userRoutes");
const contactRoute = require("./contactRoutes");
const { socialMediaRoute } = require("./socialMedia/socialMediaRoutes");
const { allMessagesRoute } = require("./messages/allMessagesRoutes");
const messageWebhook = require("./telegram/messageWebhook");
const whatsappWebhook = require("./whatsapp/wspMessageWebhook");
const fbAuthentication = require("./authentication/facebook/login");
const instagramRoutes = require("./instagram/instagramRoutes");
const messengerWebhook = require("./messenger/messengerWebhook");
const messengerMessageReceived = require("./messenger/messengerMessageReceived");
const mercadoLibreRoutes = require("../routes/mercadoLibre/mercadoLibreRoutes");
const authJwtRoute = require("./authjwtRoutes");
//const {authenticateBusiness}= require("../midlewares/authenticateBusiness");

const routes = Router();

module.exports = (io) => {
  // //RUTAS PROTEGIDAS:
  // routes.use('/mercadolibre', authenticateBusiness, mercadoLibreRoutes);
  // routes.use("/", authenticateBusiness, instagramRoutes);
  // routes.use("/business", businessRoute);
  // routes.use("/user", userRoute);
  // routes.use("/contact", contactRoute);
  // routes.use("/socialMedia", socialMediaRoute);
  // routes.use("/message", allMessagesRoute);
  // routes.use("/", messageWebhook(io));
  // //routes.use("/", messageSend(io));
  // routes.use("/whatsapp", authenticateBusiness, whatsappWebhook);
  // //routes.use("/whatsapp", whatsappSendMessage);
  // routes.use("/", fbAuthentication);
  // routes.use("/messenger", authenticateBusiness,messengerWebhook);
  // routes.use("/messenger", authenticateBusiness, messengerMessageReceived);
  // //routes.use("/messenger", sendMessengerMessage);
  // routes.use("/auth", authJwtRoute)

  //RUTAS SIN PROTECCION:
  routes.use("/mercadolibre", mercadoLibreRoutes);
  routes.use("/", instagramRoutes);
  routes.use("/business", businessRoute);
  routes.use("/user", userRoute);
  routes.use("/contact", contactRoute);
  routes.use("/socialMedia", socialMediaRoute);
  routes.use("/message", allMessagesRoute);
  routes.use("/telegram", messageWebhook(io));
  routes.use("/", whatsappWebhook);
  routes.use("/", fbAuthentication);
  routes.use("/messenger", messengerWebhook);
  routes.use("/messenger", messengerMessageReceived);
  routes.use("/auth", authJwtRoute);

  return routes;
};
