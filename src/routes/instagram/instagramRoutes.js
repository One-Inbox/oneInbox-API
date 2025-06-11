const {
  initiateInstagramLogin,
  handleInstagramCallback,
} = require("../../instagram/instagramAuthController");
const {
  processInstagramMessage,
} = require("../../instagram/processInstagramMessage");
const instagramWebhook = require("../../../src/instagram/instagramWebhook");

const { Router } = require("express");
const instagramRoutes = Router();
require("dotenv").config();

// Rutas de autenticación
instagramRoutes.get("/auth/instagram", initiateInstagramLogin);
instagramRoutes.get("/auth/instagram/callback", handleInstagramCallback);

// Ruta del webhook de Instagram
instagramRoutes.post("/webhook/instagram", instagramWebhook);
instagramRoutes.post("/webhook/instagram", async (req, res) => {
  try {
    const { object, entry } = req.body;

    // Validar que el evento pertenece a Instagram
    if (object === "instagram") {
      for (const event of entry) {
        const messageData = event.messaging[0]; // Aquí recibes los datos del mensaje
        // Procesar el mensaje
        await processInstagramMessage(messageData);
      }
    }
    res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error(
      "ERROR: No se pudo procesar el mensaje del webhook.",
      error.message
    );
    res.status(500).send("ERROR");
  }
});

instagramRoutes.get("/webhook/instagram", (req, res) => {
  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

module.exports = instagramRoutes;
