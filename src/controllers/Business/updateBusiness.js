const { Business } = require("../../db");

const updateBusiness = async (
  id,
  name,
  password,
  address,
  city,
  country,
  email,
  phone
) => {
  const businessToUpdate = await Business.findByPk(id);

  if (!businessToUpdate) {
    throw new Error(`Business with Id ${id} not found`);
  } else {
    (businessToUpdate.name = name),
      (businessToUpdate.email = email),
      (businessToUpdate.password = password),
      phone ? (businessToUpdate.phone = phone) : null,
      address ? (businessToUpdate.address = address) : null,
      city ? (businessToUpdate.city = city) : null,
      (businessToUpdate.country = country),
      await businessToUpdate.save();
    return `Congratulation! Business with ID ${id} has been update`;
  }
};

module.exports = { updateBusiness };
