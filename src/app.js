import express from 'express';
import handlebars from 'express-handlebars';
import fs from 'fs';
import path from 'path';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import ProductsRouter from './routes/products.router.js';
import CartRouter from './routes/cart.router.js';
import mongoose, { Mongoose } from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use('/api/products',ProductsRouter);
app.use('/api/carts',CartRouter)

const CONNECTION_STRING = "mongodb+srv://coderUser:VZ1z8KIjhlYoKkhX@clusterbackend1.6lepie3.mongodb.net/PreentregaFinal?retryWrites=true&w=majority&appName=ClusterBackend1"

const connection = mongoose.connect(CONNECTION_STRING);

const server = app.listen(PORT, () => console.log(`Listen port ${PORT}`));
