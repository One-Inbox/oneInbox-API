const { Router } = require("express");
const passport = require('passport');

const fbAuthentication = Router();

// Ruta para el inicio de sesión con Facebook
fbAuthentication.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['pages_show_list', 'instagram_basic', 'instagram_manage_messages', 'instagram_manage_comments']
}));

// Ruta para manejar el callback de Facebook
fbAuthentication.get('/auth/facebook/callback', passport.authenticate('facebook',{
    failureRedirect: 'http://localhost:5173/'
}), (req, res) => {
// Redirigir al usuario al dashboard después del login exitoso
    res.redirect('http://localhost:5173/')
});

module.exports = fbAuthentication
