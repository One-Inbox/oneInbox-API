const { Business } = require("../../db");

const createBusiness = async (
  name,
  password,
  address,
  city,
  country,
  email,
  phone,
  userId,
  contactId,
  socialMediaActiveId,
  msgReceivedId
) => {
  const [newBusiness, created] = await Business.findOrCreate({
    where: {
      name,
      password,
      address,
      city,
      country,
      email,
      phone,
    },
  });

  userId && (await newBusiness.setUser(userId));
  contactId && (await newBusiness.addContact(contactId));
  socialMediaActiveId &&
    (await newBusiness.addSocialMediaActive(socialMediaActiveId));
  msgReceivedId && (await newBusiness.setMsgReceived(msgReceivedId));
  return newBusiness;
};

module.exports = { createBusiness };
