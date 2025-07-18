const verifyRequestSignature = require("../utils/instagram/verifyRequestSignature");
const { processInstagramMessage } = require("./processInstagramMessage");
const { getInstagramUserName } = require("./getInstagramUserName");
require("dotenv").config();
const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce"; // Asegúrate de que este ID sea correct
const socialMediaId = 3; //este es el id de telegram

async function instagramWebhook(req, res) {
  try {
    if (!verifyRequestSignature(req)) {
      console.error("ERROR-IG: Firma de solicitud no válida.");
      return res.sendStatus(402);
    }

    const body = req.body;

    if (body.object === "instagram") {
      const entries = body.entry || [];
      for (const entry of entries) {
        const messaging = entry.messaging || [];
        for (const message of messaging) {
          // **Chequear si es un mensaje echo**
          if (message.message?.is_echo) {
            continue; // Saltar este mensaje y procesar el siguiente
          }
          try {
            if (!message.sender || !message.message) {
              throw new Error(
                "IG: Mensaje completo o sin remitente; no se puede procesar"
              );
            }
            if (!message.recipient || !message.recipient.id) {
              throw new Error(
                "IG: Mensaje sin destinatario o ID de destinatario; no se puede procesar"
              );
            }
            const senderName = await getInstagramUserName(
              message.sender.id,
              businessId
            );

            const instagramMessage = {
              chatId: message.message.mid,
              idUser: message.sender.id,
              text: message.message.text || "",
              name: senderName ? senderName : `Usuario ${message.sender.id}`,
              timestamp: message.timestamp || new Date().getTime(),
              externalId: message.message.mid
                ? `IG-${message.message.mid}`
                : null, // item agregado: Este campo puede ser opcional
              phoneNumber: null,
              businessId: businessId,
              state: "No Leidos",
              received: true,
              userName: message.recipient.id,
              socialMediaId: socialMediaId,
            };

            console.log("LOG: Procesando mensaje de Instagram...");

            const result = await processInstagramMessage(instagramMessage);
            if (!result.success) {
              console.error(
                "ERROR: Fallo al procesar el mensaje de Instagram:",
                result.error
              );
            } else {
              console.log("IG: Mensaje procesado correctamente.");
            }
          } catch (innerError) {
            console.error(
              "IG ERROR: Fallo al procesar un mensaje en la entrada:",
              innerError.message
            );
          }
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(
      "ERROR: Error al procesar el webhook de Instagram:",
      error.message
    );
    res.sendStatus(500);
  }
}

module.exports = instagramWebhook;
