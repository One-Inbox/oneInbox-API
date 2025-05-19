const {
  getBusiness,
  getBusinessByName,
  createBusiness,
} = require("../handlers/handlerBusiness");

const getBusinessFromDb = async (req, res) => {
  const { name } = req.query;
  let data;

  try {
    if (name) {
      // Si se proporciona un nombre, intenta obtener el negocio por nombre
      data = await getBusinessByName(name);
      // Verifica si la respuesta está vacía
      if (data.length === 0) {
        // Si la respuesta está vacía, arroja un error
        throw new Error("No se encontraron negocios con ese nombre.");
      }
    } else {
      // Si no se proporciona un nombre, obtén todos los negocios
      data = await getBusiness();
    }
    res.status(200).json(data);
  } catch (error) {
    // Captura cualquier error y responde con un mensaje de error y un código de estado 400
    console.error("Error al traer Business:", error.message);
    res.status(400).send("Error al traer Business: " + error.message);
  }
};

const postBusiness = async (req, res) => {
  const { name, phone, email, apiKey, srcName } = req.body;
  try {
    const business = await createBusiness(name, phone, email, apiKey, srcName);
    res.status(200).json(business);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { getBusinessFromDb, postBusiness };
