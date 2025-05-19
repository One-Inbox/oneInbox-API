const { mercadoLibreQuestionController } = require("../../controllers/mercadoLibre/mercadoLirbreQuestionsController");
const { getAccessTokenFromDB } = require("../../utils/getAccessToken");

// Handler para obtener preguntas!
const mercadoLibreQuestionHandler = async (req, res) => {
  try {
    const accessToken = await getAccessTokenFromDB();
    console.log("MELI-PREGUNTA:AccessToken de MERCADO LIBRE en QUESTION HANDLER obtenido:", accessToken);

    if (!accessToken) {
      console.error("MELI-PREGUNTA:AccessToken de MERCADO LIBRE en QUESTION HANDLER no está disponible.");
      return res.status(404).json({ message: "El accessToken es requerido pero no se encuentra disponible." });
    }

    const questions = await mercadoLibreQuestionController.getQuestions(accessToken);
    console.log("MELI-PREGUNTA:Preguntas obtenidas de MERCADO LIBRE en QUESTION HANDLER:", questions);

    if (!questions || questions.length === 0) {
      console.warn("MELI-PREGUNTA:No se encontraron preguntas de MERCADO LIBRE en QUESTION HANDLER.");
      return res.status(404).json({ message: "MELI-PREGUNTA:No se encontraron preguntas." });
    }

    return res.json(questions);
  } catch (error) {
    console.error("MELI-PREGUNTA:Error al manejar las preguntas de MERCADO LIBRE en QUESTION HANDLER:", error.message);
    res.status(500).json({ message: "MELI-PREGUNTA:Error al obtener las preguntas." });
  }
};

module.exports = {mercadoLibreQuestionHandler};
