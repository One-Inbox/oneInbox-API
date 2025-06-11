const { MsgReceived } = require("../../../db");
const deleteMsgReceivedById = async (req, res) => {
  const { id } = req.params; // Obtiene el id del parámetro de la URL

  try {
    // Busca el registro con el id proporcionado
    const message = await MsgReceived.findOne({ where: { id } });

    if (!message) {
      return res.status(404).json({
        message: `No se encontró el mensaje recibido con el id ${id}`,
      });
    }

    // Elimina el registro
    await message.destroy();

    return res.status(200).json({
      message: `Mensaje recibido con id ${id} eliminada correctamente`,
    });
  } catch (error) {
    console.error("Error al eliminar el mensaje recibido:", error.message);
    return res.status(500).json({
      message: "Error al eliminar el mensaje recibido",
      error: error.message,
    });
  }
};

module.exports = {
  deleteMsgReceivedById,
};
