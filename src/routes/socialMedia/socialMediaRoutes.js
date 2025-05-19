const { Router } = require("express");
const { socialMediaActiveRoute } = require("./socialMediaActiveRoutes");
const {
  getAllSocialMediaHandler,
} = require("../../handlers/SocialMedia/AllSocialMedia/getAllSocialMediaHandler");
const {
  addSocialMediaHandler,
} = require("../../handlers/SocialMedia/AllSocialMedia/addSocialMediaHander");
const { deleteSocialMedia } = require("../../controllers/SocialMedia/AllSocialMedia/deleteSocialMedia");
const socialMediaRoute = Router();

socialMediaRoute.get("/", getAllSocialMediaHandler);
socialMediaRoute.post("/add/", addSocialMediaHandler);
socialMediaRoute.use("/active", socialMediaActiveRoute);
socialMediaRoute.delete("/delete/:id", deleteSocialMedia);

module.exports = { socialMediaRoute };
