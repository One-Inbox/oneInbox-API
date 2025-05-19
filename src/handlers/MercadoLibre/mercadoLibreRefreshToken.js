const mercadoLibreAuthController = require("../../controllers/mercadoLibre/mercadoLibreAuthController");

const refreshTokenHandler = async (req, res) => {
  const { userId } = req.body; // Obtener el userIddesde el cuerpo de la solicitud

  try {
    // Verificar y renovar el token de acceso
    const newAccessToken = await mercadoLibreAuthController.checkAndRefreshToken(userId);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      message: "Token de acceso renovado correctamente.",
    });
  } catch (error) {
    console.error("Error al renovar el token de acceso:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Hubo un error al renovar el token de acceso.",
    });
  }
};

module.exports = {refreshTokenHandler};
