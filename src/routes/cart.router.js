import { Router } from "express";
import { makeid } from "../utils.js";
import mongoose from "mongoose";

import cartModel from "./managers/mongo/models/cart.model.js";
import cartManager from './managers/mongo/cartManager.js';

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

    const result = await manager.getCartById(cartId)

    if (result === -1) {
        return res.status(400).send({ status: "error", error: "Carts list is empty, try creating a cart first" })
    } 

    if (result === -2) {
        return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
    }

    res.send({ status: "success", message: "Cart found", cart: result})

})

router.put('/:cid/product/:pid', async (req, res) => {

    const quantity = req.body.qty ?? 1;

    if (quantity < 0){
        return res.status(400).send({ status: "error", error: "Quantity cannot be a negative number" })
    }

    const cartId = req.params.cid;

    const productId = req.params.pid;

    const result = await manager.addProductByID(cartId,productId,quantity)

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't add product to cart" })
    }
    if (result === -2) {
        return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
    }
    if (result === -3) {
        return res.status(400).send({ status: "error", error: "You are trying to add a product that doesn't exist" })
    }

    res.send({ status: "success", message: "Product added successfully", cart: result})

})

router.put('/:cid', async (req, res) => {
    
    const updatedValues = req.body;

    if (!updatedValues || !Array.isArray(updatedValues)) {
      return res.status(400).send({ status: "error", error: "Invalid data format" });
    }
    
    for (const product of updatedValues) {
        if (!product.quantity || typeof product.quantity !== 'number' || product.quantity < 0) {
          return res.status(400).send({ status: "error", error: "Invalid product format" });
        }
      
        if (!mongoose.Types.ObjectId.isValid(product.product)) {
          try {
            const objectId = mongoose.Types.ObjectId(product.product);
            product.product = objectId;
          } catch (error) {
            console.error("Error converting product.id to ObjectId:", error);
            return res.status(400).send({ status: "error", error: "Invalid product format (id)" });
          }
        }
      }

    const cartId = req.params.cid;

    const result = await manager.replaceProducts(cartId,updatedValues);

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't add product to cart" })
    }
    if (result === -2) {
        return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
    }
    if (result === -3) {
        return res.status(400).send({ status: "error", error: "You are trying to add a product that doesn't exist or repeated product" });
    }

    res.send({ status: "success", message: "Products in cart successfully updated", cart: result})

})

router.delete('/:cid/product/:pid', async (req, res) => {

    const cartId = req.params.cid;

    const productId = req.params.pid;

    const result = await manager.deleteProductByID(cartId,productId)

    if (result === -1) {
        return res.status(500).send({ status: "error", error: "Couldn't delete product from cart" })
    }

    if (result === -2) {
        return res.status(400).send({ status: "error", error: "Cart doesn's exist" })
    }

    if (result === -3) {
        return res.status(400).send({ status: "error", error: "You are trying to delete a product that doesn't exist in cart" })
    }

    res.send({ status: "success", message: "Product deleted successfully", cart: result})

})

router.delete('/:cid', async (req, res) => {

    const cartId = req.params.cid;

    const result = await manager.clearCartProductsById(cartId)

    if (result === -2) {
        return res.status(400).send({ status: "error", error: "Cart doesn's exist" })
    }

    if (result === -3) {
        return res.status(400).send({ status: "error", error: "You are trying to delete a product that doesn't exist in cart" })
    }

    res.send({ status: "success", message: "Cart cleaned successfully", cart: result})

})

export default router