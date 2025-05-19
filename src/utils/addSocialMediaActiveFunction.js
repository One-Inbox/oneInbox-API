const { SocialMediaActive, Business, SocialMedia} = require('../db');
const addSocialMediaActiveFunction = async (dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, businessId, expirationDate, userId ) => {
  console.log('businessId recibido funcion:', businessId);
  try {
        // Crear o buscar la red social activa
        const newSocialMediaActive = await SocialMediaActive.create({
            dataUser,
            active,
            socialMediaId,
            userId,
            accessToken,
            refreshToken, 
            authorizationCode,
            expirationDate,
    });
    
        console.log('Nueva SocialMediaActive creada:', newSocialMediaActive.id);
        // Buscar el negocio y la red social
        const business = await Business.findOne({where: {id: businessId}});
        const socialMedia = await SocialMedia.findByPk(socialMediaId);

        console.log('Negocio encontrado:', business ? business.id : 'No encontrado');
        console.log('Red social encontrada:', socialMedia ? socialMedia.id : 'No encontrada');
    
        // Asociar el negocio y la red social si existen
               // Asociar el negocio y la red social si existen
               if (business) {
                await newSocialMediaActive.addBusiness(business);
                console.log(`Asociado negocio ${business.id} a SocialMediaActive ${newSocialMediaActive.id}`);
            } else {
                console.warn(`No se encontró el negocio con ID ${businessId}`);
            }
            if (socialMedia) {
              await newSocialMediaActive.addSocialMedia(socialMedia);
              console.log(`Asociada red social ${socialMedia.id} a SocialMediaActive ${newSocialMediaActive.id}`);
          } else {
              console.warn(`No se encontró la red social con ID ${socialMediaId}`);
          }
  
          // Confirmar asociaciones
          const associatedBusinesses = await newSocialMediaActive.getBusinesses();
          console.log('Negocios asociados después de la inserción:', associatedBusinesses.map(b => b.id));
    
        // Retornar la red social activa creada o encontrada
        return newSocialMediaActive
      } catch (error) {
        console.error('Error en addSocialMediaActive:', error.message);
        throw new Error('No se pudo agregar la red social activa');
      }
}
module.exports = {addSocialMediaActiveFunction}