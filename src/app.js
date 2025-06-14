const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");
const { User, sessionStore } = require("./db");
const {
  telegramSendMessage,
  whatsappSendMessage,
  facebookSendMessage,
  instagramSendMessage,
  mercadoLibreSendMessage,
} = require("./utils/sentMsgFunctions/index");
const passport = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mercadoLibreAuthController = require("./controllers/mercadoLibre/mercadoLibreAuthController");

require("dotenv").config();

const server = express();
const app = http.createServer(server);

const URL_CLIENT = process.env.URL_CLIENT;
const SECUNDARY_URL_CLIENT = process.env.SECUNDARY_URL_CLIENT; // URL del cliente

const allowedOrigins = [
  URL_CLIENT,
  SECUNDARY_URL_CLIENT,
  "http://localhost:5173",
  "http://localhost:5174",
];

const io = new Server(app, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const origin = socket.handshake.headers.origin;

  // Verificar si el origen de la conexión está permitido
  if (!allowedOrigins.includes(origin)) {
    console.error("Conexión bloqueada: origen no permitido:", origin);
    return next(new Error("Origen no permitido"));
  }

  // Si el origen está permitido, continuar con la conexión
  console.log("Conexión permitida desde:", origin);
  next();
});

server.name = "server";

// Middleware personalizado para CORS
server.use((req, res, next) => {
  const origin = req.headers.origin;

  // Verifica si el origen de la solicitud está permitido
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Configuración adicional de CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Si es una solicitud OPTIONS (preflight), responde directamente
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

sessionStore.sync(); // Sincroniza el almacenamiento de sesiones con la base de datos

server.use(
  session({
    secret: "claves-secreta-de-sesion", // Reemplaza con tu secreto de sesión
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Usa el store definido
  })
);

// Inicio Passport
server.use(passport.initialize());
server.use(passport.session());

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("CONEXION A SOCKET EXITOSA");

  server.post("/newMessageReceived", async (req, res) => {
    const messageData = await req.body;
    console.log(messageData);
    try {
      // Emitir el evento desde app con los datos recibidos
      io.emit("NEW_MESSAGE_RECEIVED", messageData);
      res.status(200).send("APP/SOCKET- PREGUNTA:Evento emitido con éxito");
    } catch (error) {
      res.status(500).send("APP/SOCKET- PREGUNTA: Error al emitir el evento");
    }
  });

  if (!userId) {
    return; // Salir si userId no está definido
  }

  try {
    await User.update({ socketId: socket.id }, { where: { id: userId } });
  } catch (error) {
    console.error("Error updating user:", error);
  }

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.post("/messageSend", async (req, res) => {
  const {
    chatId,
    message,
    UserId,
    accessToken,
    businessId,
    IdSocialMedia,
    phone,
    contactId,
    idUser,
  } = req.body;

  if (
    !chatId ||
    !message ||
    !UserId ||
    !businessId ||
    !IdSocialMedia ||
    !contactId
  )
    throw new Error("APP.JS-RESPUESTA: Missing Data");
  try {
    if (IdSocialMedia === 1) {
      const response = await telegramSendMessage(
        chatId,
        message,
        UserId,
        businessId,
        contactId
      );
      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 2) {
      const response = await whatsappSendMessage(
        chatId,
        message,
        UserId,
        phone,
        businessId,
        contactId
      );
      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 3) {
      const response = await instagramSendMessage(
        chatId,
        message,
        UserId,
        businessId,
        contactId,
        idUser
      );

      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 4) {
      const response = await facebookSendMessage(
        chatId,
        message,
        UserId,
        businessId,
        contactId
      );
      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 5) {
      // const idUser = "357777393";
      // const newAccessToken =
      //   await mercadoLibreAuthController.checkAndRefreshToken(idUser);
      const response = await mercadoLibreSendMessage(
        chatId,
        message,
        UserId,
        accessToken,
        //newAccessToken,
        businessId,
        contactId
      );
      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
  } catch (error) {
    res
      .status(500)
      .send("APP-RESPUESTA:Error al enviar el mensaje: " + error.message);
  }
});

server.use("/", routes(io));

module.exports = { app, server };
