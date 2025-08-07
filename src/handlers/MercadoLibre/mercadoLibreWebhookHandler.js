const { retryOperation } = require("./mercadoLibreRetryOperation");
const {
  mercadoLibreQuestionController,
} = require("../../controllers/mercadoLibre/mercadoLirbreQuestionsController");
const {
  MsgReceived,
  Business,
  SocialMedia,
  SocialMediaActive,
} = require("../../db");
const { newContactCreated } = require("../../utils/newContact");
const { newMsgReceived } = require("../../utils/newMsgReceived");
const { postNewMsgReceived } = require("../../utils/postNewMsgReceived");
const { getAccessTokenFromDB } = require("../../utils/getAccessToken");
const mercadoLibreAuthController = require("../../controllers/mercadoLibre/mercadoLibreAuthController");
const {
  mercadoLibreOrdersController,
} = require("../../controllers/mercadoLibre/mercadoLibreOrdersController");
require("dotenv").config();

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce";
const socialMediaId = 5;
//const idUser = "357777393";

const mercadoLibreWebhookHandler = async (req, res) => {
  const { topic } = req.body;
  try {
    const accessToken = await getAccessTokenFromDB();
    if (!accessToken) {
      return res.status(404).json({
        message:
          "MELI: El accessToken es requerido pero no se encuentra disponible.",
      });
    }
    const socialMediaUser = await SocialMediaActive.findOne({
      where: { socialMediaId: socialMediaId, accessToken: accessToken },
    });
    if (!socialMediaUser) {
      return res.status(404).json({
        message: `no hay red social asociada a este token: ${accessToken}`,
      });
    }
    const idUser = socialMediaUser.userId;
    if (topic === "items") {
      res.status(200).json({
        message: "MELI-RESPUESTA:El mensaje se ha respondido conrrectamente.",
      });
    } else if (topic === "questions") {
      // await mercadoLibreAuthController.checkAndRefreshToken(idUser);
      const question = req.body;
      const resource = question.resource;
      const questionId = resource.split("/").pop();

      const questionDetails = await retryOperation(async () => {
        await mercadoLibreAuthController.checkAndRefreshToken(idUser);
        return mercadoLibreQuestionController.getQuestionDetails(
          questionId,
          accessToken
        );
      });

      // Verificar si 'from' está definido
      if (questionDetails && questionDetails.from) {
        const buyerId = questionDetails.from.id.toString();
        const buyerName = questionDetails.from.nickname || `Usuario_${buyerId}`;
        const questionText = questionDetails.text;
        const productId = questionDetails.item_id;
        const timestamp = new Date(questionDetails.date_created).getTime();
        const externalId = `MELI-${questionDetails.id}` || null; //item agregado: Este campo puede ser opcional
        // aca obtenemos el nombre del producto
        const productDetails =
          await mercadoLibreQuestionController.getProductDetails(
            productId,
            accessToken
          );
        const productName = productDetails.title || "Producto sin título";

        const existingMessage = await MsgReceived.findOne({
          where: {
            name: productName,
            idUser: buyerId,
            text: questionText,
            chatId: questionId,
          },
        });

        if (existingMessage) {
          // console.log(
          //   `MELI-PREGUNTA:Pregunta de MERCADO LIBRE en WEBHOOK HANDLER ${questionId} ya ha sido procesada previamente.`
          // );
          return res
            .status(202)
            .send("MELI-PREGUNTA:Pregunta duplicada, no se procesará.");
        }

        // Creo contacto

        const newContact = await newContactCreated(
          buyerId,
          buyerName,
          buyerName,
          true,
          questionId,
          null,
          businessId,
          socialMediaId
        );

        // Creo mensaje y lo guardo en la base de datos
        const msgReceived = await newMsgReceived(
          questionId,
          buyerId,
          questionText,
          productName,
          timestamp,
          externalId, // item agregado: Este campo puede ser opcional
          null,
          businessId,
          "No Leidos",
          true,
          productId,
          false,
          null, // idSeller: item agregado: Este campo puede ser opcional
          null, // idBuyer: item agregado: Este campo puede ser opcional
          newContact,
          socialMediaId
        );

        // Emito el mensaje a la app
        if (msgReceived.processed) {
          const business = await Business.findByPk(businessId);
          const socialMedia = await SocialMedia.findByPk(socialMediaId);
          const msgReceivedData = {
            id: msgReceived.id,
            chatId: msgReceived.chatId,
            idUser: msgReceived.idUser,
            text: msgReceived.text,
            name: msgReceived.productName,
            timestamp: msgReceived.timestamp,
            externalId: msgReceived.externalId, //Item agregado: Este campo puede ser opcional
            phoneNumber: msgReceived.phoneNumber,
            userName: msgReceived.productId,
            BusinessId: businessId,
            Business: { id: businessId, name: business.name },
            state: "No Leidos",
            received: true,
            idSeller: msgReceived.idSeller,
            idBuyer: msgReceived.idBuyer,
            ContactId: newContact.id,
            Contact: {
              id: newContact.id,
              name: newContact.productName,
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
      } else {
        console.error(
          `MELI-PREGUNTA: El objeto 'from' está indefinido para la pregunta: ${questionId}`
        );
        return res.status(400).json({
          message: `MELI-PREGUNTA: El objeto 'from' no se encontró en la respuesta de la pregunta: ${questionId}`,
        });
      }
    } else if (topic === "orders_v2") {
      await mercadoLibreOrdersController(accessToken, idUser);
      return res.status(200).json({ message: "Orden procesada" });
    } else {
      res
        .status(200)
        .json({ message: "MELI - webhook procesado correctamente" });
    }
  } catch (error) {
    console.error(
      "MELI-PREGUNTA:Error al manejar el webhook de MERCADO LIBRE en WEBHOOK HANDLER:",
      error.message
    );
    res
      .status(500)
      .json({ message: "MELI-PREGUNTA:Error al manejar el webhook." });
  }
};

module.exports = { mercadoLibreWebhookHandler };
