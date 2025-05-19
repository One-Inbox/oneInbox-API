const {Business} = require('../../db');

    const createBusiness = async (name, password, address, city, country, email, phone, srcName, userId, contactId, socialMediaActiveId, msgReceivedId) => {
        
            const [newBusiness, created] = await Business.findOrCreate({
                where: {
                    name,
                    password,
                    address,
                    city, 
                    country, 
                    email,
                    phone,
                    srcName,
                },
            })
            
            userId && await newBusiness.setUser(userId);
            contactId && await newBusiness.addContact(contactId);
            socialMediaActiveId && await newBusiness.addSocialMediaActive(socialMediaActiveId);
            msgReceivedId && await newBusiness.setMsgReceived(msgReceivedId);

            // console.log('newBusiness', newBusiness);
    
            return newBusiness;
            
    
    };

module.exports = {createBusiness};