import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductsRouter from "./routes/products.router.js";
import CartRouter from "./routes/cart.router.js";
import SessionRouter from "./routes/sessions.router.js";
import mongoose from "mongoose";
import initializePassportConfig from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

initializePassportConfig();
app.use(passport.initialize());

app.use(cookieParser());

app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartRouter);
app.use("/api/sessions", SessionRouter);

const CONNECTION_STRING =
  "mongodb+srv://coderUser:VZ1z8KIjhlYoKkhX@clusterbackend1.6lepie3.mongodb.net/PreentregaFinal?retryWrites=true&w=majority&appName=ClusterBackend1";

const connection = mongoose.connect(CONNECTION_STRING);

const server = app.listen(PORT, () => console.log(`Listen port ${PORT}`));
