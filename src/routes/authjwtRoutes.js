const { Router } = require("express");
//const {authenticateBusiness} = require("../midlewares/authenticateBusiness")
const {businessLoginHandler} = require("../handlers/JWT_Auth/businessLoginHandler")
const {businessLogoutHandler} = require("../handlers/JWT_Auth/businessLogoutHandler")
const {businessRefreshTokenHandler} = require("../handlers/JWT_Auth/businessRefreshTokenHandler")

const authJwtRoute = Router();

//RUTAS PROTEGIDAS:
// authJwtRoute.post("/login", businessLoginHandler);
//authJwtRoute.post("/logout", authenticateBusiness,businessLogoutHandler);
//authJwtRoute.post("/refreshToken", authenticateBusiness, businessRefreshTokenHandler)

//RUTAS SIN PROTECCION:
authJwtRoute.post("/login", businessLoginHandler);
authJwtRoute.post("/logout", businessLogoutHandler);
authJwtRoute.post("/refreshToken", businessRefreshTokenHandler)

module.exports = authJwtRoute