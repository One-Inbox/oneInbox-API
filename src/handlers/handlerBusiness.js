const { Business } = require("../db");

const getBusiness = async () => {
  try {
    const business = await Business.findAll();
    return business;
  } catch (error) {
    console.error("No se encontraron Business en la base de datos");
  }
};

const getBusinessByName = async (name) => {
  try {
    const business = await Business.findOne({ where: { name: name } });
    return business;
  } catch (error) {
    console.error("No se encontro Business con ese nombre");
  }
};

const createBusiness = async (name, phone, email, apiKey, srcName) => {
  console.log(name, email, phone, apiKey, srcName);
  try {
    const business = await Business.create({
      name,
      phone,
      email,
      apiKey,
      srcName,
    });
    return business;
  } catch (error) {
    console.error("Error al crear un Business");
  }
};

module.exports = {
  getBusiness,
  getBusinessByName,
  createBusiness,
};
