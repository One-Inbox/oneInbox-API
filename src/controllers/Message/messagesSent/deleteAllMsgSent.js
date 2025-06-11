const { MsgSent } = require("../../../db");
const deleteAllMsgSent = async (req, res) => {
  try {
    const count = await MsgSent.destroy({ where: {} });

    if (!count) {
      return res.status(404).json({
        message: "No se encontraron mensajes enviados",
      });
    }

    return res.status(200).json({
      message: `se vacio la bbd de mensajes enviados",`,
    });
  } catch (error) {
    console.error(
      "Error al eliminar todos los mensajes enviados:",
      error.message
    );
    return res.status(500).json({
      message: "Error al eliminar todos los mensajes enviados",
      error: error.message,
    });
  }
};

module.exports = {
  deleteAllMsgSent,
};
