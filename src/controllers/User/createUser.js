const {User, Business} = require('../../db');

    //const createUser = async (name, email, password, phone, privilege, image, login, socketId, businessId, msgSentId ) => {
    //let isLogin = login === undefined || login === null || login === false ? false : login
      const createUser = async (name, email, password, phone, privilege, image, socketId, businessId, msgSentId ) => {
        const [newUser, created] = await User.findOrCreate({
            where: { email },
            defaults: {
              name, 
              password,
              phone,
              privilege,
              socketId,
              image,
              //login: isLogin,
            }
          });
        
          if (created && businessId) {
            // Asociar el usuario al negocio correspondiente
            const business = await Business.findByPk(businessId);
            if (!business) throw new Error(`Business with id ${businessId} not found`);
            
            await newUser.setBusiness(business);
          }
            // businessId && await newUser.setBusiness(businessId); 
            // console.log('businessId', businessId);    
          
        msgSentId && await newUser.addMsgSent(msgSentId);
        
        return newUser;
    }

module.exports = {
    createUser
}