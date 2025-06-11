const { Router } = require("express");
const { handleMessage } = require("../../whatsappApi/whatsapp");
const wspMessageWebhook = Router();
require("dotenv").config();

wspMessageWebhook.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WSP_WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

wspMessageWebhook.post("/webhook/whatsapp", async (req, res) => {
  const { entry } = req.body;
  try {
    if (entry && entry[0] && entry[0].changes && entry[0].changes[0]) {
      const change = entry[0].changes[0];

      if (change.field === "messages") {
        const value = change.value;
        if (value.messages && value.messages[0]) {
          const message = value.messages[0];
          await handleMessage(value);
        }
      }
    }
    res.status(200).end();
  } catch (error) {
    console.error("WEBHOOK - Error procesando el mensaje de WhatsApp:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "WEBHOOK - Error procesando el mensaje de WhatsApp",
      });
  }
});

module.exports = wspMessageWebhook;
