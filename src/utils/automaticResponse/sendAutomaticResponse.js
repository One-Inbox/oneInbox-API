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
  const timestamps = msgReceived.timestamps ? msgReceived.timestamps : null;
  if (!timestamps) throw new Error("Missing date for message Received");

  try {
    const socialMediaActive = await searchSocialMediaActive(
      businessId,
      socialMediaId
    );
    if (!socialMediaActive) {
      throw new Error("Social Media not found");
    }
    if (socialMediaActive.automaticResponse.active === false) return;

    const date = new Date(timestamps);
    const dayOfWeek = date.getDay();
    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    const findAutomaticResponse = socialMediaActive.automaticResponse.find(
      (ar) => ar.detail.day === dayOfWeek
    );
    if (!findAutomaticResponse)
      throw new Error(`Automatic response for day ${dayOfWeek} not found`);
    if (findAutomaticResponse.detail.message === "") {
      console.warn(
        "No hay mensaje automatico cargado en la red social",
        socialMediaId,
        "para el dia",
        dayOfWeek
      );
      return;
    }
    const msgToSent = {
      chatId: msgReceived.chatId,
      message: findAutomaticResponse.detail.message,
      UserId: msgReceived.UserId,
      accessToken: msgReceived.accessToken || null,
      businessId,
      IdSocialMedia: socialMediaId,
      phone: msgReceived.phone || null,
      contactId: msgReceived.contactId,
      idUser: msgReceived.idUser || null,
      idSeller: msgReceived.idSeller || null,
      idBuyer: msgReceived.idBuyer || null,
    };

    const { startHour, endHour } = findAutomaticResponse.detail;
    if (startHour === null || endHour === null) {
      await axios.post(`${URL_API}/messageSend`, msgToSent);
    } else {
      const [startH, startM] = startHour.split(":").map(Number);
      const currentStartMinutes = startH * 60 + startM;
      const [endH, endM] = endHour.split(":").map(Number);
      const currentEndMinutes = endH * 60 + endM;
      if (
        currentMinutes < currentStartMinutes ||
        currentMinutes > currentEndMinutes
      ) {
        await axios.post(`${URL_API}/messageSend`, msgToSent);
      } else {
        return;
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = { sendAutomaticResponse };
