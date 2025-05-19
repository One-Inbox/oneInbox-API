//controlador (mercadoLibreQuestionController) que gestiona la interacción con la API de Mercado Libre para obtener preguntas, detalles de preguntas, detalles de productos y registrar un webhook para recibir notificaciones de nuevas preguntas.

const axios = require("axios");

const mercadoLibreQuestionController = {
  getQuestions: async (accessToken) => {
    try {
      const response = await axios.get(
        "https://api.mercadolibre.com/questions/search",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "MELI-PREGUNTA:Error al obtener las preguntas:",
        error.response ? error.response.data : error.message
      );
      throw new Error("MELI-PREGUNTA:No se pudieron obtener las preguntas.");
    }
  },
  getQuestionDetails: async (questionId, accessToken) => {
    if (!questionId && !accessToken) {
      console.error(
        "MELI-PREGUNTA:El questionId o accessToken es inválido o no está presente."
      );
      throw new Error("MELI-PREGUNTA:El questionId o accessToken es inválido.");
    }
    try {
      console.log(`MELI-PREGUNTA CONTROLLER: Obteniendo detalles de la pregunta ${questionId}...` );
      const response = await axios.get(
        `https://api.mercadolibre.com/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`MELI-PREGUNTA CONTROLLER: Detalles de la pregunta ${questionId} obtenidos exitosamente.`, response.data);

      return response.data;
    } catch (error) {
      console.log(
        `MELI-PREGUNTA:Error al obtener los detalles de la pregunta ${questionId}:`,
      )
      throw new Error(
        "MELI-PREGUNTA:No se pudieron obtener los detalles de la pregunta."
      );
    }
  },
  
  getProductDetails: async (itemId, accessToken) => {
    try {
      console.log(`MELI-PRODUCTO: Obteniendo detalles del producto ${itemId}...`);
      const response = await axios.get(
        `https://api.mercadolibre.com/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`MELI-PRODUCTO: Detalles del producto ${itemId} obtenidos exitosamente.`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `MELI-PRODUCTO:Error al obtener los detalles del producto ${itemId}:`,
        error.response?.data || error.message
      );
      throw new Error("MELI-PRODUCTO:No se pudieron obtener los detalles del producto.");
    }
  },
  
  registerWebhook: async (accessToken, userId, applicationId) => {
    try {
      console.log(`MELI-PREGUNTA CONTROLLER: Registrando webhook para el usuario ${userId} y aplicación ${applicationId}...`);

      const response = await axios.post(
        `https://api.mercadolibre.com/users/${userId}/applications/${applicationId}/notifications`,
        {
          user_id: userId,
          topic: "questions",
          application_id: applicationId,
          //DESARROLLO
          url: "https://electrica-mosconi-backend.onrender.com/mercadolibre/webhook",
          //PRODUCCION
          //url: "https://electrica-mosconi-backend-main.onrender.com/mercadolibre/webhook",

          mode: "self",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("MELI-PREGUNTA:Webhook registrado:", response.data);
    } catch (error) {
      console.error(
        "MELI-PREGUNTA:Error al registrar el webhook:",
        error.response?.data || error.message
      );
      throw new Error("MELI-PREGUNTA:No se pudo registrar el webhook.");
    }
  },
};

module.exports = { mercadoLibreQuestionController };
