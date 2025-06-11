const {
  mercadoLibreQuestionController,
} = require("../../controllers/mercadoLibre/mercadoLirbreQuestionsController");

const mercadoLibreRegisterWebhookHandler = async (req, res) => {
  try {
    const { accessToken, userId, applicationId } = req.body;
    if (!accessToken || !userId || !applicationId) {
      console.error(
        "MELI-PREGUNTA:Parámetros de MERCADO LIBRE en REGISTER WEBHOOK HANDLER faltantes"
      );
      return res
        .status(400)
        .json({
          message:
            "Token de acceso, userId y applicationId de meli son requeridos.",
        });
    }

    await mercadoLibreQuestionController.registerWebhook(
      accessToken,
      userId,
      applicationId
    );
    console.log(
      "MELI-PREGUNTA:Webhook de MERCADO LIBRE en REGISTER WEBHOOK HANDLER registrado correctamente."
    );
    return res.json({
      message: "MELI-PREGUNTA:Webhook de meli registrado correctamente.",
    });
  } catch (error) {
    console.error(
      "MELI-PREGUNTA:Error al registrar el webhook de MERCADO LIBRE en REGISTER WEBHOOK HANDLER:",
      error.message
    );
    res
      .status(500)
      .json({ message: "MELI-PREGUNTA:Error al registrar el webhook." });
  }
};

module.exports = { mercadoLibreRegisterWebhookHandler };
