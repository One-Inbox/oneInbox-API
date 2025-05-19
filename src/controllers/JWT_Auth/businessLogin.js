const { Business} = require("../../db");
const jwt = require("jsonwebtoken");
require('dotenv').config();

//const cookieParser = require('cookie-parser')
const businessLogin = async (businessName, password) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "OneInbox-i2an2UxPEdw23pfhrrAI-ElectricaMosconi"
    try {
        console.log("Buscando negocio en la base de datos...");
        const business = await Business.findOne({ where: { name: businessName, password } });
        if (!business) throw new Error('Business not found');

        console.log("Negocio encontrado:", business.name);

        const token = jwt.sign(
            { id: business.id, name: business.name },
             JWT_SECRET_KEY, // Clave secreta desde el entorno
            { expiresIn: "365d" }
        );

        console.log("Token generado correctamente.");
        return { business, token };
    } catch (error) {
        console.error("Error en el controlador de login:", error.message);
        throw error; // Relanza el error para que sea manejado por el handler
    }
};


module.exports = {businessLogin}