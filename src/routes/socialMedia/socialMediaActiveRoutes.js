const {Router} = require('express');
const {getAllSocialMediaActiveHandler} = require('../../handlers/SocialMedia/SocialMediaActive/getAllSocialMediaActiveHandler');
// const {getSocialMediaActiveByIdHandler} = require('../../handlers/socialMedia/socialMediaActive/getSocialMediaActiveByIdHandler');
const {addSocialMediaActiveHandler} = require('../../handlers/SocialMedia/SocialMediaActive/addSocialMediaActiveHandler');
const {updateSocialMediaActiveHandler} = require('../../handlers/SocialMedia/SocialMediaActive/updateSocialMediaActiveHandler');
const { deleteSocialMediaActiveHandler } = require('../../handlers/SocialMedia/SocialMediaActive/deleteSocialMediaActiveHandler');
//const {authenticateBusiness} =require("../../midlewares/authenticateBusiness")

const socialMediaActiveRoute = Router();

//RUTAS PROTEGIDAS:
// socialMediaActiveRoute.get('/', authenticateBusiness, getAllSocialMediaActiveHandler);
// // socialMediaActiveRoute.get('/:id', getSocialMediaActiveByIdHandler);
// socialMediaActiveRoute.post('/add/', authenticateBusiness, addSocialMediaActiveHandler);
// socialMediaActiveRoute.put('/update/:id', authenticateBusiness, updateSocialMediaActiveHandler);
// socialMediaActiveRoute.delete('/delete/:id', authenticateBusiness,deleteSocialMediaActiveHandler)

//RUTAS SIN PROTECCION
socialMediaActiveRoute.get('/', getAllSocialMediaActiveHandler);
// socialMediaActiveRoute.get('/:id', getSocialMediaActiveByIdHandler);
socialMediaActiveRoute.post('/add/', addSocialMediaActiveHandler);
socialMediaActiveRoute.put('/update/:id', updateSocialMediaActiveHandler);
socialMediaActiveRoute.delete('/delete/:id',deleteSocialMediaActiveHandler);

module.exports = {socialMediaActiveRoute};