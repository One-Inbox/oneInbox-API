const axios = require("axios");
require("dotenv").config();

const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com"; // URL de la API

const postNewMsgReceived = async (msgReceivedData, res) => {
  try {
    // Filtrar mensajes de tipo echo
    if (msgReceivedData?.is_echo) {
      res && res.status(200).send("Mensaje de tipo echo ignorado");
      return;
    }
    await axios.post(`${URL_API}/newMessageReceived`, msgReceivedData);
    res && res.status(200).send("OK");
  } catch (error) {
    console.error(
      "PREGUNTA:Error al enviar datos del mensaje recibido a app",
      error.message
    );
    res &&
      res
        .status(500)
        .json({ message: "PREGUNTA: Error al enviar los datos a la app." });
  }
};

module.exports = { postNewMsgReceived };
