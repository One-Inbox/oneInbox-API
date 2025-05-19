const mercadoLibreAuthController = require("../controllers/mercadoLibre/mercadoLibreAuthController");
const { SocialMediaActive } = require("../db");

const renewTokensPeriodically = () => {
  setInterval(async () => {
    try {
      // Obtenemos todos los registros activos de Mercado Libre en SocialMediaActive
      const activeTokens = await SocialMediaActive.findAll({
        where: { dataUser: "Mercado Libre", socialMediaId: 5, active: true },
      });

      if (!activeTokens || activeTokens.length === 0) {
        console.log("No hay tokens activos para renovar.");
        return;
      }

      for (const tokenData of activeTokens) {
        const { userId } = tokenData; // Obtenemos el userId de cada registro

        try {
          const accessToken = await mercadoLibreAuthController.checkAndRefreshToken(userId);

          if (accessToken) {
            console.log(`Token renovado automáticamente para el userId ${userId}:`, accessToken);
          } else {
            console.log(`El token para el userId ${userId} no necesitó renovación.`);
          }
        } catch (error) {
          console.error(`Error al renovar el token para el userId ${userId}:`, error.message);
        }
      }
    } catch (error) {
      console.error("Error al verificar los tokens:", error.message);
    }
  }, 60 * 60 * 1000); // Verificar cada hora
};

module.exports = { renewTokensPeriodically };
