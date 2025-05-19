const { SocialMedia } = require('../../../db'); 

const deleteSocialMedia = async (req, res) => {
  const { id } = req.params; // Extraemos id de la social media 

  try {
    const socialMediaToDelete = await SocialMedia.findByPk(id); // encontramos la social media segun id

    if (!socialMediaToDelete) {
      return res.status(404).json({ message: 'Social Media not found' }); // manejamos error si no se encuentra
    }

    await socialMediaToDelete.destroy(); // borramos el registro de la bd

    res.status(200).json({ message: 'Social Media deleted successfully' }); // mensaje exitoso
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting Social Media' }); // error si falla el servidor
  }
};

module.exports = {
  deleteSocialMedia,
};