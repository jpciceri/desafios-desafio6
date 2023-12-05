import express from "express";
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import __dirname from "./utils.js";
import {  Server} from "socket.io";
import mongoose from "mongoose";
import cartsRouter from "./src/routes/cart.routes.js";
import productsRouter from "./src/routes/product.routes.js";
import viewsRouter from "./src/routes/views.routes.js";
import {  messageModel} from "./src/dao/models/message.model.js";
import ProductManager from "./src/dao/ProductManager.js";
import { allowInsecurePrototypeAccess} from "@handlebars/allow-prototype-access";
import sessionsRouter from "./src/routes/sessions.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./src/config/passport.config.js";
import cookieParser from "cookie-parser";
import {ENV_CONFIG} from "./src/config/config.js";
import cors from "cors"
import emailRouter from "./src/routes/email.routes.js";
import mockingRouter from "./src/mocking/mock.router.js";
import { addLogger, devLogger} from "./src/config/logger.js";
import loggerRouter from "./src/routes/logger.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from 'swagger-ui-express';
import usersRouter from "./src/routes/users.routes.js";


const app = express();
const port = ENV_CONFIG.PORT || 8080;

const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title:"documentacion API casio",
      description:"Documentacion del uso de las apis relacionadas"
    }

  },
  apis:[
  `./src/docs/**/*.yaml`
  ]
};

const specs = swaggerJSDoc(swaggerOptions);



const httpServer = app.listen(port, () => {
  devLogger.info("Servidor escuchando en puerto " + port);
});
export const socketServer = new Server(httpServer);

app.set("socketServer", socketServer);

app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
//declaro endpoint swagger
app.use('/apidocs',swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
app.use(express.static(__dirname));
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(addLogger);
app.use(session({
  secret: process.env.SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    collectionName: "sessions",
  })
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/sessions/", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);
app.use('/email', emailRouter);
app.use('/mockingproducts', mockingRouter);
app.get("/logger", loggerRouter);
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
app.get('/loggerTest', (req, res) => {
  devLogger.fatal('Esto es un fatal de prueba.');
  devLogger.error('Esto es un error de prueba.');
  devLogger.warn('Esto es un warning de prueba.');
  devLogger.info('Esto es un registro de prueba.');
  devLogger.http('Esto es un http trace de prueba.');
  devLogger.debug('Esto es un debug de prueba.');
  res.

  send('Registros de prueba generados en el servidor.');
});


const PM = new ProductManager();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



mongoose.connection.on("connected", () => {
  devLogger.info("Conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  devLogger.error("Error conectando a MongoDB:", err);
});

socketServer.on("connection", async (socket) => {
  devLogger.info("Un cliente se ha conectado");

  const allProducts = await PM.getProducts();
  socket.emit("initial_products", allProducts.payload);

  const previousMessages = await messageModel.find().sort({
    timestamp: 1
  });
  socket.emit("previous messages", previousMessages);

  socket.on("message", (data) => {
    devLogger.info("Mensaje recibido del cliente:", data);
  });

  socket.on("socket_individual", (data) => {
    devLogger.info("Evento 'socket_individual' recibido:", data);
  });

  socket.on("chat message", async (message) => {
    devLogger.info("Received message object:", JSON.stringify(message, null, 2));

    const newMessage = new messageModel({
      user: message.user,
      message: message.text,
      timestamp: new Date(),
    });
    await newMessage.save();

    socketServer.emit("chat message", {
      user: message.user,
      message: message.text,
    });
  });
});