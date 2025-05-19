//Este código maneja la autenticación con la API de Mercado Libre y el almacenamiento de los tokens de acceso en la base de datos.
const  mercadoLibreAuthController  = require("../../controllers/mercadoLibre/mercadoLibreAuthController");
const {updateSocialMediaActive} = require("../../controllers/SocialMedia/SocialMediaActive/updateSocialMediaActive")
const {addSocialMediaActive} = require("../../controllers/SocialMedia/SocialMediaActive/addSocialMediaActive")
const { SocialMediaActive, Business} = require("../../db");
//const { addSocialMediaActiveFunction } = require("../../utils/addSocialMediaActiveFunction");
const socialMediaId = 5;
const businessId = "c3ea9d75-db7c-4dda-bca5-232d4a2b2ba1"


const mercadoLibreAuthHandler = async (req, res) => {
  const business = await Business.findByPk(businessId)
  const idBusiness = business && business.id ? business.id : businessId;
  const SMActive = business && business.SocialMediaActives && business.SocialMediaActives.find(sm => sm.socialMediaId === socialMediaId)
  const dataUser = SMActive ? SMActive.dataUser : 'electricamosconicaba@gmail.com';
  console.log('buscando el dataUser:', SMActive);
  
  //const {businessId} = req.body
  const code = req.body.code || req.query.code  //tomo el codigo desde el query o desde el body que envia el fornt
  console.log("Código recibido de Mercado Libre1:", code);

  try {
    //if (req.query.code) {
      if (code) {
      const { accessToken, refreshToken, authorizationCode, expires_in, userId } =
        //await mercadoLibreAuthController.getAccessToken(req.query.code);
        await mercadoLibreAuthController.getAccessToken(code);

      const expirationDate = new Date(Date.now() + (expires_in || 21600) * 1000); 
      const userIdString = userId ? userId.toString() : null
      //const socialMediaActive = await SocialMediaActive.findOne({where: {socialMediaId: socialMediaId, businessId: idBusiness }});
      const socialMediaActive = await SocialMediaActive.findOne({
        include: {
          model: Business,
          where: { id: idBusiness }, // Buscamos el 'businessId' a través de la relación
          through: { attributes: [] }, // No necesitamos los atributos de la tabla intermedia
        },
        where: { socialMediaId: socialMediaId }, // Buscamos por 'socialMediaId'
      });
      if (!socialMediaActive) {
        await addSocialMediaActive(dataUser, true, socialMediaId, expirationDate, accessToken, refreshToken, authorizationCode, idBusiness, userIdString)
      } else {
        const socialMediaActiveId = socialMediaActive.id
        await updateSocialMediaActive(socialMediaActiveId, dataUser, true, socialMediaId, accessToken, refreshToken, authorizationCode, expirationDate, userIdString )
      }


      const validAccessToken = await mercadoLibreAuthController.checkAndRefreshToken(userId);

      return res.json({
        message: "MELI-AUTH: Tokens guardados correctamente en la base de datos",
        accessToken: validAccessToken,
      });
    } else {
      const authUrl = mercadoLibreAuthController.getAuthUrl();
      return res.redirect(authUrl);
    }
  } catch (error) {
    console.error("MELI-AUTH: Error al redirigir a Mercado Libre:", error);
    res.status(500).json({ message: "MELI-AUTH: Error en la autenticación con Mercado Libre" });
  }
};

const mercadoLibreCallbackHandler = async (req, res) => {
  const business = await Business.findByPk(businessId)
  const idBusiness = business && business.id ? business.id : businessId;
  const SMActive = business && business.SocialMediaActives && business.SocialMediaActives.find(sm => sm.socialMediaId === socialMediaId)
  const dataUser = SMActive ? SMActive.dataUser : 'electricamosconicaba@gmail.com';
  console.log('buscando el dataUser:', SMActive);
  
  try {
    //const { code } = req.query;
    const code = req.body.code || req.query.code // el codigo por query o por body que manda el front
    console.log("Código recibido de Mercado Libre2:", code);

    if (!code) {
      return res
        .status(400)
        .json({ message: "MELI-AUTH: No se proporcionó el código de autorización." });
    }

    const { accessToken, refreshToken, authorizationCode, userId, expires_in } =
      await mercadoLibreAuthController.getAccessToken(code);

    // Calcular la fecha de expiración del token
    const expirationDate = new Date(Date.now() + (expires_in || 21600) * 1000); // Default a 6 horas si expires_in es indefinido

    console.log("MELI-AUTH: expires_in recibido:", expires_in);
    console.log("MELI-AUTH: expirationDate calculado:", expirationDate);
    
    console.log("MELI-AUTH: Tokens recibidos:", {
      accessToken,
      refreshToken,
      authorizationCode,
      userId,
      expirationDate, // Agregamos expirationDate al log
    });


    //VER SI ESTO NO DEBERIA SER UN UPDATE
    //const socialMediaActive = await SocialMediaActive.findOne({where: {socialMediaId: socialMediaId, businessId: idBusiness }});
    const socialMediaActive = await SocialMediaActive.findOne({
      include: {
        model: Business,
        where: { id: idBusiness }, // Buscamos el 'businessId' a través de la relación
        through: { attributes: [] }, // No necesitamos los atributos de la tabla intermedia
      },
      where: { socialMediaId: socialMediaId }, // Buscamos por 'socialMediaId'
    });
    const userIdString = userId ? userId.toString() : null
    if(!socialMediaActive) {
      await addSocialMediaActive(dataUser, true, socialMediaId, expirationDate, accessToken, refreshToken, authorizationCode, idBusiness, userIdString)
    } else {
      const socialMediaActiveId = socialMediaActive.id
      await updateSocialMediaActive(socialMediaActiveId, dataUser, true, socialMediaId, accessToken, refreshToken, authorizationCode, expirationDate, userIdString)
    }
    

    return res.json({
      message: "MELI-AUTH: Tokens guardados correctamente en la base de datos",
    });
  } catch (error) {
    console.error(
      "MELI-AUTH H: Error al obtener el token de acceso:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "MELI-AUTH H: Error al obtener el token de acceso" });
  }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
