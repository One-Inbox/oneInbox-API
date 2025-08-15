const axios = require("axios");
const { searchSocialMediaActive } = require("./searchSocialMediaActive");
require("dotenv").config();
const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com";

const sendAutomaticResponse = async (msgReceived) => {
  if (!msgReceived) throw new Error("Missing Data");
  const socialMediaId = msgReceived.SocialMediumId
    ? msgReceived.SocialMediumId
    : null;
  const businessId = msgReceived.BusinessId ? msgReceived.BusinessId : null;
  if (!socialMediaId || !businessId)
    throw new Error("Missing data for search Social Media Active");
  // const timestamp = msgReceived.timestamp ? msgReceived.timestamp : null;
  // if (!timestamp) throw new Error("Missing date for message Received");

  try {
    const socialMediaActive = await searchSocialMediaActive(
      businessId,
      socialMediaId
    );
    if (!socialMediaActive) {
      throw new Error("Social Media not found");
    }
    if (socialMediaActive.automaticResponse.active === false) return;

    const date = await new Date(Date.now());
    const dayOfWeek = await date.getDay();
    const currentMinutes = (await date.getHours()) * 60 + date.getMinutes();

    console.log(
      `Procesando mensaje - Día: ${dayOfWeek}, Hora actual: ${date.getHours()}:${date.getMinutes()}`
    );

    const findAutomaticResponse =
      await socialMediaActive.automaticResponse.detail.find(
        (ar) => Number(ar.day) === Number(dayOfWeek)
      );
    if (!findAutomaticResponse) {
      console.log(
        `No hay configuración de respuesta automática para el día ${dayOfWeek}`
      );
      throw new Error(`Automatic response for day ${dayOfWeek} not found`);
    }
    console.log(
      " Configuración de respuesta automática encontrada:",
      findAutomaticResponse
    );

    if (
      !findAutomaticResponse.message ||
      findAutomaticResponse.message === "" ||
      findAutomaticResponse.message === null
    ) {
      console.warn(
        "No hay mensaje automatico cargado en la red social",
        socialMediaActive.id,
        "para el dia",
        dayOfWeek
      );
      return;
    }
    const accessToken = socialMediaActive.accessToken || null;
    const message = findAutomaticResponse && findAutomaticResponse.message;
    console.log(`Mensaje automático encontrado: "${message}"`);

    const msgToSent = {
      chatId: msgReceived.chatId,
      message: message,
      UserId: msgReceived.UserId ? msgReceived.UserId : msgReceived.idUser,
      accessToken,
      businessId,
      IdSocialMedia: socialMediaId,
      phone: msgReceived.phone || null,
      contactId: msgReceived.contactId,
      idUser: msgReceived.idUser || null,
      idSeller: msgReceived.idSeller || null,
      idBuyer: msgReceived.idBuyer || null,
    };

    const { startHour, endHour } = findAutomaticResponse;
    console.log(
      `Configuración encontrada - Horario: ${startHour} - ${endHour}, Mensaje: "${findAutomaticResponse.message}"`
    );
    if (
      startHour === null ||
      endHour === null ||
      startHour === "" ||
      endHour === ""
    ) {
      console.log("Sin horarios configurados, enviando respuesta automática");
      await axios.post(`${URL_API}/messageSend`, msgToSent);
    } else {
      const [startH, startM] = startHour.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const [endH, endM] = endHour.split(":").map(Number);
      const endMinutes = endH * 60 + endM;

      console.log(
        `Horario de atención: ${startMinutes} - ${endMinutes} minutos, Actual: ${currentMinutes} minutos`
      );

      // Verificar si estamos DENTRO del horario de atención
      let isWithinBusinessHours = false;
      if (startMinutes <= endMinutes) {
        // Horario normal (ej: 09:00 - 17:00)
        isWithinBusinessHours =
          currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      } else {
        // Horario que cruza medianoche (ej: 22:00 - 06:00)
        isWithinBusinessHours =
          currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      }

      console.log(`¿Dentro del horario de atención? ${isWithinBusinessHours}`);

      // if (
      //   currentMinutes < currentStartMinutes ||
      //   currentMinutes > currentEndMinutes
      // ) {
      //   await axios.post(`${URL_API}/messageSend`, msgToSent);
      // } else {
      //   return;
      // }
      // Enviar mensaje automático solo si está FUERA del horario de atención
      if (!isWithinBusinessHours) {
        console.log(
          "FUERA del horario de atención -> Enviando respuesta automática"
        );
        await axios.post(`${URL_API}/messageSend`, msgToSent);
      } else {
        console.log(
          "DENTRO del horario de atención -> NO se envía respuesta automática"
        );
      }
    }
  } catch (error) {
    console.error("Error en sendAutomaticResponse:", error);
    throw error;
  }
};

module.exports = { sendAutomaticResponse };
