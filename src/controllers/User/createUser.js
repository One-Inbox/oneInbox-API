const { User, Business } = require("../../db");

const createUser = async (
  name,
  email,
  password,
  phone,
  privilege,
  image,
  socketId,
  businessId,
  msgSentId
) => {
  const [newUser, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      password,
      phone,
      privilege,
      socketId,
      image,
    },
  });

  if (created && businessId) {
    // Asociar el usuario al negocio correspondiente
    const business = await Business.findByPk(businessId);
    if (!business) throw new Error(`Business with id ${businessId} not found`);

    await newUser.setBusiness(business);
  }

  msgSentId && (await newUser.addMsgSent(msgSentId));

  return newUser;
};

module.exports = {
  createUser,
};
