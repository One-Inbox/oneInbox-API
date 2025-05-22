const verifyRequestSignature = require("../utils/instagram/verifyRequestSignature");
const { processInstagramMessage } = require("./processInstagramMessage");

async function instagramWebhook(req, res) {
  try {
    if (!verifyRequestSignature(req)) {
      console.error("ERROR: Firma de solicitud no válida.");
      return res.sendStatus(402);
    }

    const body = req.body;

    if (body.object === "instagram") {
      console.log(
        "LOG: Mensaje directo de Instagram recibido:",
        JSON.stringify(body, null, 2)
      );

      const entries = body.entry || [];
      for (const entry of entries) {
        const messaging = entry.messaging || [];
        for (const message of messaging) {
          // **Chequear si es un mensaje echo**
          if (message.message?.is_echo) {
            console.log(
              "LOG: Mensaje de tipo echo recibido en instagramWebhook. Ignorando mensaje con ID:",
              message.message.mid
            );
            continue; // Saltar este mensaje y procesar el siguiente
          }
          try {
            console.log("sender", message.sender);
            console.log("recipient", message.recipient);

            const instagramMessage = {
              chatId: message.message.mid,
              idUser: message.sender.id,
              text: message.message.text || "",
              name: `Usuario ${message.sender.id}`,
              timestamp: message.timestamp,
              phoneNumber: null,
              businessId: "228a060d-2374-4fcd-a4ab-6f7187dc5051",
              state: "No Leidos",
              received: true,
              userName: message.recipient.id,
              socialMediaId: 3,
            };

            console.log(
              "LOG: Procesando mensaje de Instagram...",
              instagramMessage
            );

            const result = await processInstagramMessage(instagramMessage);
            if (!result.success) {
              console.error(
                "ERROR: Fallo al procesar el mensaje de Instagram:",
                result.error
              );
            } else {
              console.log("LOG: Mensaje procesado correctamente.");
            }
          } catch (innerError) {
            console.error(
              "ERROR: Fallo al procesar un mensaje en la entrada:",
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
