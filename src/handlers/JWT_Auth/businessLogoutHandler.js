require('dotenv').config();

const businessLogoutHandler = (req, res) => {
    res.clearCookie("access_token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout exitoso" });
};

module.exports = {businessLogoutHandler}