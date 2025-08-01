//Este código maneja la autenticación con la API de Mercado Libre y el almacenamiento de los tokens de acceso en la base de datos.
const mercadoLibreAuthController = require("../../controllers/mercadoLibre/mercadoLibreAuthController");
const {
  updateSocialMediaActive,
} = require("../../controllers/SocialMedia/SocialMediaActive/updateSocialMediaActive");
const {
  addSocialMediaActive,
} = require("../../controllers/SocialMedia/SocialMediaActive/addSocialMediaActive");
const { SocialMediaActive, Business } = require("../../db");
require("dotenv").config();

const businessId =
  process.env.BUSINESS_ID || "c3844993-dea7-42cc-8ca7-e509e27c74ce"; // Default businessId if not set in environment variables
const socialMediaId = 5;

const mercadoLibreAuthHandler = async (req, res) => {
  const business = await Business.findByPk(businessId);
  const idBusiness = business && business.id ? business.id : businessId;
  const SMActive =
    business &&
    business.SocialMediaActives &&
    business.SocialMediaActives.find(
      (sm) => sm.socialMediaId === socialMediaId
    );
  const dataUser = SMActive
    ? SMActive.dataUser
    : "electricamosconicaba@gmail.com";

  const code = req.body.code || req.query.code; //tomo el codigo desde el query o desde el body que envia el fornt

  try {
    if (code) {
      const {
        accessToken,
        refreshToken,
        authorizationCode,
        expires_in,
        userId,
      } = await mercadoLibreAuthController.getAccessToken(code);

      const expirationDate = new Date(
        Date.now() + (expires_in || 21600) * 1000
      );
      const userIdString = userId ? userId.toString() : null;
      const socialMediaActive = await SocialMediaActive.findOne({
        include: {
          model: Business,
          where: { id: idBusiness }, // Buscamos el 'businessId' a través de la relación
          through: { attributes: [] }, // No necesitamos los atributos de la tabla intermedia
        },
        where: { socialMediaId: socialMediaId }, // Buscamos por 'socialMediaId'
      });
      if (!socialMediaActive) {
        await addSocialMediaActive(
          dataUser,
          true,
          socialMediaId,
          expirationDate,
          accessToken,
          refreshToken,
          authorizationCode,
          idBusiness,
          userIdString
        );
      } else {
        const socialMediaActiveId = socialMediaActive.id;
        await updateSocialMediaActive(
          socialMediaActiveId,
          dataUser,
          true,
          socialMediaId,
          accessToken,
          refreshToken,
          authorizationCode,
          expirationDate,
          userIdString
        );
      }

      const validAccessToken =
        await mercadoLibreAuthController.checkAndRefreshToken(userId);

      return res.json({
        message:
          "MELI-AUTH: Tokens guardados correctamente en la base de datos",
        accessToken: validAccessToken,
      });
    } else {
      const authUrl = mercadoLibreAuthController.getAuthUrl();
      return res.redirect(authUrl);
    }
  } catch (error) {
    console.error("MELI-AUTH: Error al redirigir a Mercado Libre:", error);
    res.status(500).json({
      message: "MELI-AUTH: Error en la autenticación con Mercado Libre",
    });
  }
};

const mercadoLibreCallbackHandler = async (req, res) => {
  const business = await Business.findByPk(businessId);
  const idBusiness = business && business.id ? business.id : businessId;
  const SMActive =
    business &&
    business.SocialMediaActives &&
    business.SocialMediaActives.find(
      (sm) => sm.socialMediaId === socialMediaId
    );
  const dataUser = SMActive
    ? SMActive.dataUser
    : "electricamosconicaba@gmail.com";

  try {
    const code = req.body.code || req.query.code; // el codigo por query o por body que manda el front
    console.log("Código recibido de Mercado Libre2:", code);

    if (!code) {
      return res.status(400).json({
        message: "MELI-AUTH: No se proporcionó el código de autorización.",
      });
    }

    const { accessToken, refreshToken, authorizationCode, userId, expires_in } =
      await mercadoLibreAuthController.getAccessToken(code);

    // Calcular la fecha de expiración del token
    const expirationDate = new Date(Date.now() + (expires_in || 21600) * 1000); // Default a 6 horas si expires_in es indefinido

    const socialMediaActive = await SocialMediaActive.findOne({
      include: {
        model: Business,
        where: { id: idBusiness }, // Buscamos el 'businessId' a través de la relación
        through: { attributes: [] }, // No necesitamos los atributos de la tabla intermedia
      },
      where: { socialMediaId: socialMediaId }, // Buscamos por 'socialMediaId'
    });
    const userIdString = userId ? userId.toString() : null;
    if (!socialMediaActive) {
      await addSocialMediaActive(
        dataUser,
        true,
        socialMediaId,
        expirationDate,
        accessToken,
        refreshToken,
        authorizationCode,
        idBusiness,
        userIdString
      );
    } else {
      const socialMediaActiveId = socialMediaActive.id;
      await updateSocialMediaActive(
        socialMediaActiveId,
        dataUser,
        true,
        socialMediaId,
        accessToken,
        refreshToken,
        authorizationCode,
        expirationDate,
        userIdString
      );
    }

    return res.json({
      message: "MELI-AUTH: Tokens guardados correctamente en la base de datos",
    });
  } catch (error) {
    console.error(
      "MELI-AUTH H: Error al obtener el token de acceso:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: "MELI-AUTH H: Error al obtener el token de acceso" });
  }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
