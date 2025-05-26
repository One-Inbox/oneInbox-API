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
//const { log } = require("console");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const server = express();
const app = http.createServer(server);

const io = new Server(app, {
  cors: {
    origin: [
      "https://electrica-mosconi-frontend-ebon.vercel.app",
      "http://localhost:5173",
    ],
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

const URL_CLIENT = process.env.URL_CLIENT;
const SECUNDARY_URL_CLIENT = process.env.SECUNDARY_URL_CLIENT; // URL del cliente
const allowedOrigins = [
  URL_CLIENT,
  SECUNDARY_URL_CLIENT,
  "http://localhost:5173",
  "http://localhost:5174",
];

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

  //console.log(`Received userId: ${userId}`); // Registro para depuración

  if (io) {
    io.emit("SE_EMITEN_OTRAS_COSAS", "ok");
    // message && io.emit("NEW_MESSAGE_RECEIVED", message)
  }

  server.post("/newMessageReceived", async (req, res) => {
    const messageData = await req.body;
    console.log(messageData);
    try {
      // Emitir el evento desde app con los datos recibidos
      io.emit("NEW_MESSAGE_RECEIVED", messageData);
      // console.log(
      //   `APP/SOCKET- PREGUNTA: Evento 'NEW_MESSAGE_RECEIVED' emitido con datos:`,
      //   messageData
      // );
      res.status(200).send("APP/SOCKET- PREGUNTA:Evento emitido con éxito");
    } catch (error) {
      //console.error("APP/SOCKET- PREGUNTA: Error al emitir el evento desde app:", error);
      res.status(500).send("APP/SOCKET- PREGUNTA: Error al emitir el evento");
    }
  });

  if (!userId) {
    //console.error("userId is undefined or null");
    return; // Salir si userId no está definido
  }

  try {
    await User.update({ socketId: socket.id }, { where: { id: userId } });
    console.log(`Cliente conectado ${socket.id}`);
  } catch (error) {
    console.error("Error updating user:", error);
  }

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.post("/messageSend", async (req, res) => {
  console.log("APP-RESPUESTA body:", req.body);
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

  //console.log('en app', UserId);
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
      console.log(
        "mando respuesta a telegram con data :",
        chatId,
        message,
        UserId,
        businessId,
        contactId
      );
      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        console.log(
          `APP-RESPUESTA:Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`
        );
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        console.log(
          `APP-RESPUESTA:Evento 'ADD_NEW_MESSAGE_SENT' emitido con mensaje: ${msgSentData}`
        );
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 2) {
      console.log("data que sale desde app a funcion de whats:", {
        chatId,
        message,
        UserId,
        phone,
        businessId,
        contactId,
      });

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
        console.log(
          `APP-RESPUESTA:Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`
        );
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        console.log(
          `APP-RESPUESTA:Evento 'ADD_NEW_MESSAGE_SENT' emitido con mensaje: ${msgSentData}`
        );
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
      console.log("respuesta de la funcion", response);

      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        console.log(
          `APP-RESPUESTA:Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`
        );
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        console.log(
          `APP-RESPUESTA:Evento 'ADD_NEW_MESSAGE_SENT' emitido con mensaje: ${msgSentData}`
        );
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
        console.log(
          `APP-RESPUESTA:Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`
        );
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        console.log(
          `APP-RESPUESTA:Evento 'ADD_NEW_MESSAGE_SENT' emitido con mensaje: ${msgSentData}`
        );
        res.status(200).send(response.message);
      } else {
        res.status(500).send(response.message);
      }
    }
    if (IdSocialMedia === 5) {
      const response = await mercadoLibreSendMessage(
        chatId,
        message,
        UserId,
        accessToken,
        businessId,
        contactId
      );
      console.log("APP-RESPUESTA:respusta envio msj Meli", response);

      if (response.success) {
        io.emit("NEW_MESSAGE_SENT", { chatId, message, UserId });
        // console.log(
        //   `APP-RESPUESTA:Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`
        // );
        const msgSentData = response.msgSent;
        io.emit("ADD_NEW_MESSAGE_SENT", msgSentData);
        // console.log(
        //   `APP-RESPUESTA:Evento 'ADD_NEW_MESSAGE_SENT' emitido con mensaje: ${msgSentData}`
        // );
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
