const { MsgReceived } = require("../../../db");
const deleteAllMsgReceived = async (req, res) => {
  try {
    const count = await MsgReceived.destroy({ where: {} });

    if (!count) {
      return res.status(404).json({
        message: "No se encontraron mensajes recibidos",
      });
    }

    return res.status(200).json({
      message: `se vacio la bandeja de entrada de mensajes recibidos`,
    });
  } catch (error) {
    console.error(
      "Error al eliminar todos los mensajes recibidos:",
      error.message
    );
    return res.status(500).json({
      message: "Error al eliminar todos los mensajes recibidos",
      error: error.message,
    });
  }
};

module.exports = {
  deleteAllMsgReceived,
};
