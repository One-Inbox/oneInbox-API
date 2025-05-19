const { Router } = require("express");
const {
  getBusinessByIdHandler,
} = require("../handlers/Business/getBusinessByIdHandler");
const {
  updateBusinessHandler,
} = require("../handlers/Business/updateBusinessHandler");
const {
  createBusinessHandler,
} = require("../handlers/Business/createBusinessHandler");
//const {authenticateBusiness} = require("../midlewares/authenticateBusiness")

const businessRoute = Router();
//RUTAS PROTEGIDAS:
//businessRoute.get("/:id", authenticateBusiness, getBusinessByIdHandler);
//businessRoute.post("/create", createBusinessHandler);
//businessRoute.put("/update/:id", authenticateBusiness,updateBusinessHandler);

//RUTAS SIN PROTECCION:
businessRoute.get("/:id", getBusinessByIdHandler);
businessRoute.post("/create", createBusinessHandler);
businessRoute.put("/update/:id",updateBusinessHandler);

module.exports = businessRoute;

