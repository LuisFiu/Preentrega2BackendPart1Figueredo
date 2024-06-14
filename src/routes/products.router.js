import { Router } from "express";

import ProductManager from './managers/productManager.js';

const manager = new ProductManager();

const router = Router();

router.post('/', async (req, res) => {

    const product = req.body;

    if (!product.title || !product.description || !product.code || !product.price) {
        return res.status(400).send({ status: "error", error: "Incomplete values" })
    }

    if (typeof product.price !== 'number' || isNaN(product.price)) {
        return res.status(400).send({ status: "error", error: "Price isn't a number" });
    }

    if (product.stock == null) {
        product.stock = 1;
    } else {
        if (typeof product.stock !== 'number' || isNaN(product.stock) || product.stock < 0) {
            return res.status(400).send({ status: "error", error: "Stock isn't a number or is a negative value" });
        }
    }

    if (product.status == null) {
        product.status = true
    } else {
        if (typeof product.status !== 'boolean') {
            return res.status(400).send({ status: "error", error: "Status isn't true or false" });
        }
    }

    if (product.category == null) {
        product.category = "Generic"
    } else {
        if (typeof product.category !== 'string') {
            return res.status(400).send({ status: "error", error: "Category isn't a Text" });
        }
    }

    // Usuario envió todo OK se procede a crear el producto

    const result = await manager.createProduct(product)

    if (result === -1) {

        // Usuario envio todo OK pero no se pudo crear el producto

        return res.status(500).send({ status: "error", error: "Couldn't create product" })
    }

    // Producto creado

    res.send({ status: "success", message: "Product Created", product: product })

})

router.get('/', async (req, res) => {
    const products = await manager.getProducts()

    if (products == null) {
        return res.status(500).send({ status: "error", error: "Couldn't get Products" })
    } else

        return res.status(200).send({ status: "success", payload: products })

})

router.get('/:id', async (req, res) => {

    const productId = req.params.id;

    const parsedProductId = parseInt(productId, 10);

    if (isNaN(parsedProductId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Product ID" });
    }

    const result = await manager.getProductById(productId);

    if (result === -1) {
        return res.status(400).send({ status: "error", message: "Product list is empty, try creating a product first" });
    } else if (result === -2) {
        return res.status(400).send({ status: "error", message: "Product doesn't exist" });
    } else if (result === null) {
        return res.status(500).send({ status: "error", message: "An error occurred during get Product" });
    }

    res.send({ status: "success", payload: result });
});

router.put('/:id', async (req, res) => {

    const productId = req.params.id;

    const parsedProductId = parseInt(productId, 10);

    if (isNaN(parsedProductId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Product ID" });
    }

    const updatedValues = req.body;

    console.log(`Received ID: ${productId}`);
    console.log(`Updated Values:`, updatedValues);

    if (updatedValues.title == null) {
    } else {
        if (typeof updatedValues.title !== 'string') {
            return res.status(400).send({ status: "error", error: "Title isn't a Text" });
        }
    }
    if (typeof updatedValues.price !== 'number' || isNaN(updatedValues.price)) {
        return res.status(400).send({ status: "error", error: "Price isn't a number" });
    }

    if (updatedValues.stock == null) {
    } else {
        if (typeof updatedValues.stock !== 'number' || isNaN(updatedValues.stock) || updatedValues.stock < 0) {
            return res.status(400).send({ status: "error", error: "Stock isn't a number or is a negative value" });
        }
    }

    if (updatedValues.status == null) {

    } else {
        if (typeof updatedValues.status !== 'boolean') {
            return res.status(400).send({ status: "error", error: "Status isn't true or false" });
        }
    }

    if (updatedValues.category == null) {

    } else {
        if (typeof updatedValues.category !== 'string') {
            return res.status(400).send({ status: "error", error: "Category isn't a Text" });
        }
    }

    const result = await manager.editProduct(productId, updatedValues);

    if (result === -1) {
        return res.status(400).send({ status: "error", message: "Product list is empty, try creating a product first" });
    } else if (result === -2) {
        return res.status(400).send({ status: "error", message: "Product doesn't exist" });
    } else if (result === null) {
        return res.status(500).send({ status: "error", message: "An error occurred during the update" });
    }

    res.send({ status: "success", updatedProduct: result });
});

router.delete('/:id', async (req, res) => {

    const productId = req.params.id;

    const parsedProductId = parseInt(productId, 10);

    if (isNaN(parsedProductId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Product ID" });
    }

    const result = await manager.deleteProduct(productId);

    if (result === -1) {
        return res.status(400).send({ status: "error", message: "Product list is empty, try creating a product first" });
    } else if (result === -2) {
        return res.status(400).send({ status: "error", message: "Product doesn't exist" });
    } else if (result === null) {
        return res.status(500).send({ status: "error", message: "An error occurred during the delete" });
    }

    res.send({ status: "success", deletedProduct: result });
});

export default router