const cron = require("node-cron");
const { refreshLongLivedToken } = require("./instagramTokenController");
const {SocialMediaActive}  = require("../db");

cron.schedule("0 0 * * 0", async () => {
  // Ejecutar cada domingo a la medianoche
  try {
    const tokens = await SocialMediaActive.findAll({
      where: { socialMediaId: 3, accessToken }, // Solo tokens de Instagram
    });

    for (const token of tokens) {
      try {
        const now = new Date();
        const expirationDate = new Date(token.expirationDate);

        // Refrescar si el token expira en los próximos 7 días
        if (expirationDate - now < 7 * 24 * 60 * 60 * 1000) {
          await refreshLongLivedToken(token.accessToken, token.userId);
        }
      } catch (error) {
        console.error(
          "Error al refrescar tokens automáticamente:",
          error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Error al refrescar tokens automáticamente 2:",
      error.message
    );
  }
});
