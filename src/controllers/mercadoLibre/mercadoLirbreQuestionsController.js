const axios = require("axios");
require("dotenv").config();

const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com"; // URL de la API

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
      console.log(
        `MELI-PREGUNTA CONTROLLER: Obteniendo detalles de la pregunta ${questionId}...`
      );
      const response = await axios.get(
        `https://api.mercadolibre.com/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(
        `MELI-PREGUNTA CONTROLLER: Detalles de la pregunta ${questionId} obtenidos exitosamente.`
      );

      return response.data;
    } catch (error) {
      console.log(
        `MELI-PREGUNTA:Error al obtener los detalles de la pregunta ${questionId}: ${error.response?.data} || ${error.message}`
      );
      throw new Error(
        "MELI-PREGUNTA:No se pudieron obtener los detalles de la pregunta."
      );
    }
  },

  getProductDetails: async (itemId, accessToken) => {
    try {
      console.log(
        `MELI-PRODUCTO: Obteniendo detalles del producto ${itemId}...`
      );
      const response = await axios.get(
        `https://api.mercadolibre.com/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(
        `MELI-PRODUCTO: Detalles del producto ${itemId} obtenidos exitosamente.`
      );
      return response.data;
    } catch (error) {
      console.error(
        `MELI-PRODUCTO:Error al obtener los detalles del producto ${itemId}:`,
        error.response?.data || error.message
      );
      throw new Error(
        "MELI-PRODUCTO:No se pudieron obtener los detalles del producto."
      );
    }
  },

  registerWebhook: async (accessToken, userId, applicationId) => {
    try {
      console.log(
        `MELI-PREGUNTA CONTROLLER: Registrando webhook para el usuario ${userId} y aplicación ${applicationId}...`
      );

      const response = await axios.post(
        `https://api.mercadolibre.com/users/${userId}/applications/${applicationId}/notifications`,
        {
          user_id: userId,
          topic: "questions",
          application_id: applicationId,
          url: `${URL_API}/mercadolibre/webhook`,
          mode: "self",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("MELI-PREGUNTA:Webhook registrado");
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
