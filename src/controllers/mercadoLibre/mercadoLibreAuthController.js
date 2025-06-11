//controlador de autenticación para Mercado Libre : Su propósito es manejar el proceso de autenticación y renovación de tokens de acceso para poder interactuar con la API de Mercado Libre.
const axios = require("axios");
const querystring = require("querystring"); //Se usa para convertir objetos JavaScript en strings con formato x-www-form-urlencoded (necesario para enviar datos a la API de Mercado Libre).
require("dotenv").config();
const { SocialMediaActive } = require("../../db");

const mercadoLibreAuthController = {
  getAuthUrl: () => {
    const clientId = process.env.ML_CLIENT_ID;
    const redirectUri =
      process.env.ML_REDIRECT_URI || "https://oneinbox.vercel.app/MeLi_auth"; // URL a donde Mercado Libre redirige después de la autenticación.
    return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  },

  getAccessToken: async (authorizationCode) => {
    if (!authorizationCode) {
      throw new Error("MELI-AUTH: El código de autorización es requerido.");
    }
    const clientId = process.env.ML_CLIENT_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;
    const redirectUri = process.env.ML_REDIRECT_URI;

    try {
      console.log("MELI-AUTH: Intercambiando código por token de acceso...");
      const response = await axios.post(
        "https://api.mercadolibre.com/oauth/token",
        querystring.stringify({
          grant_type: "authorization_code", //Indica que se intercambiará un código por un token.
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri, //La URL a donde Mercado Libre redirige con el código de autorización.
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const {
        access_token, //token que permite hacer solicitudes a la API de Mercado Libre.
        refresh_token, //Token que permite renovar el access_token cuando expire.
        expires_in = 21600, //Tiempo en segundos hasta que expire el access_token (por defecto, 6 horas).
        user_id, //ID del usuario en Mercado Libre.
      } = response.data;

      // Validar y calcular expirationDate
      if (typeof expires_in !== "number" || expires_in <= 0) {
        console.warn(
          "MELI-AUTH: El campo expires_in es inválido. Se usará el valor predeterminado de 6 horas."
        );
      }

      const expirationDate = new Date(Date.now() + expires_in * 1000);
      console.log("MELI-AUTH: Fecha de expiración calculada:", expirationDate);

      return {
        accessToken: access_token,
        refreshToken: refresh_token,
        expires_in,
        expirationDate,
        authorizationCode,
        userId: user_id, // Incluimos el user id para obtenerlo y usarlo como dataUser
      };
    } catch (error) {
      console.error(
        "MELI-AUTH: Error al obtener el token de acceso:",
        error.response?.data || error.message
      );
      throw new Error(
        "MELI-AUTH: No se pudo obtener el token de acceso. Verifica el código de autorización y otros parámetros."
      );
    }
  },

  refreshAccessToken: async (refreshToken) => {
    const clientId = process.env.ML_CLIENT_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;

    try {
      console.log("MELI-AUTH: Renovando token de acceso...");
      const response = await axios.post(
        "https://api.mercadolibre.com/oauth/token",
        querystring.stringify({
          grant_type: "refresh_token", //indica que se usa un refresh_token para obtener un nuevo access_token
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = response.data;
      console.log("MELI-AUTH: Nuevo token de acceso obtenido:", response.data);

      const newExpirationDate = new Date(Date.now() + expires_in * 1000);

      return { accessToken: access_token, newRefreshToken, newExpirationDate };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(
          "MELI-AUTH: El refresh token ha expirado o es inválido. Se requiere reautenticación."
        );
        throw new Error(
          "MELI-AUTH: El refresh token ha expirado o es inválido. Realiza la autenticación nuevamente."
        );
      }
      console.error(
        "MELI-AUTH: Error al renovar el token de acceso:",
        error.message
      );
      throw error;
    }
  },

  checkAndRefreshToken: async (userId) => {
    try {
      const socialMediaActive = await SocialMediaActive.findOne({
        where: {
          dataUser: "Mercado Libre",
          userId: userId,
          socialMediaId: 5,
          active: true,
        },
      });

      if (!socialMediaActive) {
        throw new Error(
          "MELI-AUTH: No se encontró un token activo en la base de datos."
        );
      }

      const { accessToken, refreshToken, expirationDate } = socialMediaActive;

      if (new Date(expirationDate).getTime() - Date.now() < 3600000) {
        console.log("MELI-AUTH: El token está por expirar. Renovando...");
        const {
          accessToken: newAccessToken,
          newRefreshToken,
          newExpirationDate,
        } = await mercadoLibreAuthController.refreshAccessToken(refreshToken);

        await socialMediaActive.update({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expirationDate: newExpirationDate,
        });

        console.log(
          "MELI-AUTH: Token renovado y guardado en la base de datos."
        );
        return newAccessToken;
      }

      return accessToken;
    } catch (error) {
      console.error("MELI-AUTH: Error al verificar o renovar el token:", error);
      throw error;
    }
  },
};

module.exports = mercadoLibreAuthController;
