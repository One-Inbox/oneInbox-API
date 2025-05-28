const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
const URL_API = process.env.URL_API || "https://oneinbox-api.onrender.com";

// Configuración de la estrategia de Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${URL_API}/auth/facebook/callback`,
      //DESARROLLO
      //callbackURL: "https://electrica-mosconi-backend.onrender.com/auth/facebook/callback",
      //PRODUCCION:
      //callbackURL: "https://electrica-mosconi-backend-main.onrender.com/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      //aca podemos buscar en la base de datos al usuario por su Facebook ID
      // y crear uno nuevo si no existe.
      return done(null, profile);
    }
  )
);

// Serialización del usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialización del usuario de la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
