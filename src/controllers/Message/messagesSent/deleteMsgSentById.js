const { MsgSent } = require("../../../db");
const deleteMsgSentById = async (req, res) => {
  const { id } = req.params; // Obtiene el id del parámetro de la URL

  try {
    // Busca el registro con el id proporcionado
    const message = await MsgSent.findOne({ where: { id } });

    if (!message) {
      return res.status(404).json({
        message: `No se encontró el mensaje enviado con el id ${id}`,
      });
    }

    // Elimina el registro
    await message.destroy();

    return res.status(200).json({
      message: `Mensaje enviado con id ${id} eliminada correctamente`,
    });
  } catch (error) {
    console.error("Error al eliminar el mensaje enviado:", error.message);
    return res.status(500).json({
      message: "Error al eliminar el mensaje enviado",
      error: error.message,
    });
  }
};

module.exports = {
  deleteMsgSentById,
};
