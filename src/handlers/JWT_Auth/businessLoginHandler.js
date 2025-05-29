const { businessLogin } = require("../../controllers/JWT_Auth/businessLogin");
require("dotenv").config();

const businessLoginHandler = async (req, res) => {
  const { businessName, password } = req.body;
  console.log("Datos recibidos: ", { businessName, password });
  try {
    if (!businessName || !password) throw new Error("Missing Data");
    // Llama al controlador para validar y obtener el token
    const { business, token } = await businessLogin(businessName, password);
    // Configura la cookie con el token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict", // Protección CSRF
      path: "/",
    });
    console.log("token en businessLogin guardado en la cookie", token);

    res.status(201).json({ business });
  } catch (error) {
    console.log("error en login", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { businessLoginHandler };
