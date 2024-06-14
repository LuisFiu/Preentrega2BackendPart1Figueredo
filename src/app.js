import express from 'express';
import handlebars from 'express-handlebars';
import fs from 'fs';
import path from 'path';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import ProductsRouter from './routes/products.router.js'
import CartRouter from './routes/cart.router.js'
import ViewsRouter from './routes/views.router.js'

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use('/',ViewsRouter);
app.use('/api/products',ProductsRouter);
app.use('/api/carts',CartRouter)

const server = app.listen(PORT, () => console.log(`Listen port ${PORT}`));

const socketServer = new Server(server);

socketServer.on('connection', (socketClient) => {
    
    console.log('Connected');

    const productsFilePath = path.join(__dirname, 'files', 'products.json');

    const sendProductsUpdate = () => {
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading products file:', err);
                return;
            }
            const products = JSON.parse(data);
            socketServer.emit('updateProducts', products);
        });
    };

    fs.watch(productsFilePath, (eventType, filename) => {
        if (filename && eventType === 'change') {
            console.log(`The file ${filename} was updated.`);
            sendProductsUpdate();
        }
    });

    sendProductsUpdate();

});


