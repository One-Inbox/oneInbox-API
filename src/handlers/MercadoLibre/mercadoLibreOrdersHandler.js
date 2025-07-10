const { getAccessTokenFromDB } = require("../../utils/getAccessToken");
const { SocialMediaActive } = require("../../db");
const {
  mercadoLibreOrdersController,
} = require("../../controllers/mercadoLibre/mercadoLibreOrdersController");

const mercadoLibreOrdersHanlder = async (req, res) => {
  try {
    const accessToken = await getAccessTokenFromDB();
    if (!accessToken) {
      return res.status(404).json({
        message:
          "MELI: El accessToken es requerido en ORDERS pero no se encuentra disponible.",
      });
    }
    const socialMediaUser = await SocialMediaActive.findOne({
      where: { socialMediaId: 5, accessToken: accessToken },
    });
    if (!socialMediaUser) {
      return res.status(404).json({
        message: `no hay red social asociada a este token: ${accessToken}`,
      });
    }
    const userId = socialMediaUser.userId;
    const orders = await mercadoLibreOrdersController(accessToken, userId);
    !orders
      ? res.status(404).json("Orders not found")
      : res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { mercadoLibreOrdersHanlder };
