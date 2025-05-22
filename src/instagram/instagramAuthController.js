const axios = require("axios");
const { URLSearchParams } = require("url");
const { SocialMediaActive, Business, SocialMedia } = require("../db");
const { getLongLivedToken } = require("./instagramTokenController");

require("dotenv").config();

async function initiateInstagramLogin(req, res) {
  const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`;
  res.redirect(authUrl);
}

async function handleInstagramCallback(req, res) {
  const code = req.query.code;
  const clientId = process.env.INSTAGRAM_APP_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  const dataUser = "Instagram"; // Para identificar esta red social
  const socialMediaId = 3; // ID de la red social correspondiente a Instagram en tu base de datos
  const businessId = "228a060d-2374-4fcd-a4ab-6f7187dc5051"; // Ajusta según corresponda

  try {
    // Solicitar el token de acceso de corta duración
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", redirectUri);
    params.append("code", code);

    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      params
    );
    console.log("Respuesta completa de Instagram:", response.data); // Ver la respuesta completa de la API de Instagram

    // Obtener los datos del token de corta duración y el user_id
    const { access_token: shortLivedToken, user_id } = response.data;
    if (!user_id) {
      throw new Error("Instagram no devolvió un user_id válido.");
    }
    const userId = user_id.toString();

    // Convertir user_id a cadena para evitar problemas con BIGINT
    console.log("Token de corta duración obtenido:", shortLivedToken);

    // Obtener el token de larga duración
    console.log("Pasando a getLongLivedToken:", { shortLivedToken, userId });

    const longLivedToken = await getLongLivedToken(shortLivedToken, userId);

    console.log("Token de larga duración obtenido:", longLivedToken); // Validar que user_id sea del tipo correcto

    if (typeof user_id !== "string" && typeof user_id !== "number") {
      throw new Error(
        `userId debe ser una cadena o número, recibido: ${typeof user_id}`
      );
    }
    console.log(
      "Antes de conversión user_id:",
      user_id,
      "Tipo:",
      typeof user_id
    );
    //const userId = user_id.toString(); // Convertir BIGINT a STRING igual que en meli
    console.log(
      "Después de conversión userId:",
      userId,
      "Tipo:",
      typeof userId
    );

    const expires_in = 60 * 60 * 24 * 60; // Tokens largos duran 60 días
    const expirationDate = new Date(Date.now() + expires_in * 1000);

    console.log("Instagram Auth: Tokens obtenidos:", response.data);
    // Guarda los tokens en la base de datos
    const socialMediaActive = await SocialMediaActive.findOne({
      where: { socialMediaId: socialMediaId, userId: userId },
    });

    if (!socialMediaActive) {
      console.log("No existe registro previo, creando uno nuevo...");
      // Lógica movida desde addSocialMediaActiveFunction
      const newSocialMediaActive = await SocialMediaActive.create({
        dataUser,
        active: true,
        socialMediaId,
        userId,
        accessToken: longLivedToken,
        refreshToken: null,
        authorizationCode: code,
        expirationDate,
      });
      console.log("Nuevo registro creado:", newSocialMediaActive);

      const business = await Business.findByPk(businessId);
      const socialMedia = await SocialMedia.findByPk(socialMediaId);

      if (business) {
        await newSocialMediaActive.addBusiness(business);
      }
      if (socialMedia) {
        await newSocialMediaActive.addSocialMedia(socialMedia);
      }
    } else {
      console.log("Actualizando registro existente...");
      socialMediaActive.accessToken = longLivedToken;
      socialMediaActive.userId = userId;
      socialMediaActive.authorizationCode = code;
      socialMediaActive.expirationDate = expirationDate;
      await socialMediaActive.save();
    }

    return res.json({
      message:
        "Instagram Auth: Tokens guardados correctamente en la base de datos",
      accessToken: longLivedToken,
      authorizationCode: code,
      userId: userId,
    });
  } catch (error) {
    console.error(
      "Error al obtener el token de acceso de Instagram:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Error al obtener el token de acceso de Instagram" });
  }
}

module.exports = {
  initiateInstagramLogin,
  handleInstagramCallback,
};
