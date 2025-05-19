const { SocialMediaActive} = require('../../../db');
const deleteSocialMediaActiveById = async (req, res) => {
    const { id } = req.params; // Obtiene el id del parámetro de la URL
  
    try {
      // Busca el registro con el id proporcionado
      const socialMediaActive = await SocialMediaActive.findOne({ where: { id } });
  
      if (!socialMediaActive) {
        return res.status(404).json({ message: `No se encontró la red social activa con el id ${id}` });
      }
  
      // Elimina el registro
      await socialMediaActive.destroy();
  
      return res.status(200).json({ message: `Red social activa con id ${id} eliminada correctamente` });
    } catch (error) {
      console.error('Error al eliminar la red social activa:', error.message);
      return res.status(500).json({ message: 'Error al eliminar la red social activa', error: error.message });
    }
  };
  
  module.exports = {
    deleteSocialMediaActiveById,
  };