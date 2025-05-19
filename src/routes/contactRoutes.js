const { Router } = require("express");
const {getAllContactsHandler} = require("../handlers/Contacts/getAllContactsHandler")
const {getContactByIdHandler} = require("../handlers/Contacts/getContactByIdHandler");
//const {authenticateBusiness} = require("../midlewares/authenticateBusiness")

const contactRoute = Router();
//RUTAS PROTEGIDAS:
// contactRoute.get("/", authenticateBusiness, getAllContactsHandler)
// contactRoute.get("/:id", authenticateBusiness, getContactByIdHandler);

//RUTAS SIN PROTECCION:
contactRoute.get("/", getAllContactsHandler)
contactRoute.get("/:id", getContactByIdHandler);

module.exports = contactRoute;
