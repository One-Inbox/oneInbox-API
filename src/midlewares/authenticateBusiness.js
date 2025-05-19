const jwt = require("jsonwebtoken");
require('dotenv').config();


const authenticateBusiness = (req, res, next) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "OneInbox-i2an2UxPEdw23pfhrrAI-ElectricaMosconi"
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado: token no encontrado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.business = decoded; // Añadir la información del negocio a la request
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};

module.exports = { authenticateBusiness };
