const { Router } = require("express");
const {
  mercadoLibreAuthHandler,
  mercadoLibreCallbackHandler,
} = require("../../handlers/MercadoLibre/mercadoLibreAuthHandler");
const {
  mercadoLibreQuestionHandler,
} = require("../../handlers/MercadoLibre/mercadoLibreQuestionHandler");
const {
  mercadoLibreRegisterWebhookHandler,
} = require("../../handlers/MercadoLibre/mercadoLibreRegisterWebhookHandler");
const {
  mercadoLibreWebhookHandler,
} = require("../../handlers/MercadoLibre/mercadoLibreWebhookHandler");
const {
  refreshTokenHandler,
} = require("../../handlers/MercadoLibre/mercadoLibreRefreshToken");

const mercadoLibreRoutes = Router();

// Ruta para iniciar la autenticación de Mercado Libre
mercadoLibreRoutes.get("/auth", mercadoLibreAuthHandler);

// Ruta para manejar el callback de la autenticación
mercadoLibreRoutes.get("/auth/callback", mercadoLibreCallbackHandler);
mercadoLibreRoutes.post("/auth/callback", mercadoLibreCallbackHandler); //para obtener el code desde el front

mercadoLibreRoutes.post("/questions", mercadoLibreQuestionHandler);
mercadoLibreRoutes.post("/webhook", mercadoLibreWebhookHandler);
mercadoLibreRoutes.post(
  "/register-webhook",
  mercadoLibreRegisterWebhookHandler
);

// Ruta para actualizar el token de acceso
mercadoLibreRoutes.post("/refresh-token", refreshTokenHandler);

module.exports = mercadoLibreRoutes;
