import { Router } from "express";

import cartManager from './managers/cartManager.js';

const manager = new cartManager();

const router = Router();

router.post('/', async (req, res) => {

    const result = await manager.createCart()

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't create cart" })
    }

    res.send({ status: "success", message: "Cart Created", cart: []})

})

router.get('/:cid', async (req, res) => {

    const cartId = req.params.cid;

    const parsedCartId = parseInt(cartId, 10);

    if (isNaN(parsedCartId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Cart ID" });
    }

    const result = await manager.getCartById(cartId)

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't create cart" })
    }

    res.send({ status: "success", message: "Cart found", cart: result})

})

router.post('/:cid/product/:pid', async (req, res) => {

    const cartId = req.params.cid;

    const productId = req.params.pid;

    const parsedProductId = parseInt(productId, 10);

    const parsedCartId = parseInt(cartId, 10);

    if (isNaN(parsedCartId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Cart ID" });
    }

    if (isNaN(parsedProductId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Product ID" });
    }

    const result = await manager.addProductByID(cartId,parsedProductId)

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't add product to cart" })
    }

    res.send({ status: "success", message: "Product added successfully", cart: result})

})

router.delete('/:cid/product/:pid', async (req, res) => {

    const cartId = req.params.cid;

    const productId = req.params.pid;

    const parsedProductId = parseInt(productId, 10);

    const parsedCartId = parseInt(cartId, 10);

    if (isNaN(parsedCartId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Cart ID" });
    }

    if (isNaN(parsedProductId)) {
        return res.status(400).send({ status: "error", message: "Please send a valid Product ID" });
    }

    const result = await manager.deleteProductByID(cartId,parsedProductId)

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't delete product from cart" })
    }

    if (result === -3) {
        return res.status(400).send({ status: "error", error: "Product doesn't exist on cart" })
    }

    res.send({ status: "success", message: "Product deleted successfully", cart: result})

})

export default router