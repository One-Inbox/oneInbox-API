const { createBusiness } = require("../../controllers/Business/createBusiness");

const createBusinessHandler = async (req, res) => {
  const { name, password, address, city, country, email, phone, srcName } =
    req.body;
  //const{name, password, address, city, country, email, phone} = req.body;

  try {
    if (!name || !password || !country || !email)
      throw new Error("Missing Data");
    // if(!name || !password || !country || !email) throw new Error('Missing Data');
    const newBusiness = await createBusiness(
      name,
      password,
      address,
      city,
      country,
      email,
      phone,
      srcName
    );
    //  const newBusiness = await createBusiness(name, password, address, city, country, email, phone);
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBusinessHandler };
