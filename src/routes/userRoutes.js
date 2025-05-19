const { Router } = require("express");
const {getAllUsersHandler} = require("../handlers/User/getAllUserHandler");
const {getUserByIdHandler} = require("../handlers/User/getUserByIdHandler");
const {createUserHandler} = require("../handlers/User/createUserHandler");
const {updateUserHandler} = require("../handlers/User/updateUserHandler");
const {deleteUserHandler} = require("../handlers/User/deleteUserHandler");
const {authenticateBusiness}= require("../midlewares/authenticateBusiness")

const userRoute = Router();
//RUTAS PROTEGIDAS:
// userRoute.get("/", authenticateBusiness, getAllUsersHandler);
// userRoute.get("/:id", authenticateBusiness, getUserByIdHandler);
// userRoute.post("/create", authenticateBusiness, createUserHandler);
// userRoute.put("/update/:id", authenticateBusiness, updateUserHandler);
// userRoute.delete("/delete/:id", authenticateBusiness, deleteUserHandler);

//RUTAS SIN PROTECCION:
userRoute.get("/", getAllUsersHandler);
userRoute.get("/:id", getUserByIdHandler);
userRoute.post("/create", createUserHandler);
userRoute.put("/update/:id", updateUserHandler);
userRoute.delete("/delete/:id", deleteUserHandler);

module.exports = userRoute;
