import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";

export default class cartManager {
  async getCarts() {
    try {
      const carts = await cartModel.find();
      if ((carts = [])) {
        return -1;
      }
      return carts;
    } catch (error) {
      return null;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();

      if (carts === -1) {
        console.log({
          status: "error",
          message: "Carts list is empty, try creating a cart first",
        });
        return -1;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        console.log({ status: "error", message: "Cart doesn't exist" });
        return -2;
      }

      console.log({
        status: "success",
        message: "Cart found correctly",
        cart: cart,
      });

      return cart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async createCart() {
    try {
      const cart = await cartModel.create({ products: [] });
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      return -1;
    }
  }

  async addProductByID(id, pid, qty) {
    try {
      const cart = await cartModel.findOne({ _id: id });
      if (!cart) {
        console.log({ status: "error", message: "Cart doesn't exist" });
        return -2;
      }

      const foundProduct = await productModel.findOne({ _id: pid });
      if (!foundProduct) {
        console.log({ status: "error", message: "Product doesn't exist" });
        return -3;
      }

      const productInCart = cart.products.find((p) => p.product.equals(pid));

      if (productInCart) {
        await cartModel.findOneAndUpdate(
          { _id: id, "products.product": pid },
          { $inc: { "products.$.quantity": qty } }
        );
      } else {
        await cartModel.findOneAndUpdate(
          { _id: id },
          { $push: { products: { product: pid, quantity: qty } } }
        );
      }

      const updatedCart = await cartModel.findOne({ _id: id });

      return updatedCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async replaceProducts(id, updatedValues) {
    try {
      const carts = await this.getCarts();

      if (carts === -1) {
        console.log({
          status: "error",
          message: "Carts list is empty, try creating a cart first",
        });
        return -1;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        console.log({ status: "error", message: "Cart doesn't exist" });
        return -2;
      }

      const productIds = updatedValues.map((product) => product.product);

      const foundProducts = await productModel.find({
        _id: { $in: productIds },
      });

      if (foundProducts.length !== productIds.length) {
        return -3;
      }

      const updatedCart = await cartModel.updateOne(
        { _id: id },
        { $set: { products: updatedValues } }
      );

      const finalCart = await cartModel.findOne({ _id: id });

      return finalCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async deleteProductByID(id, pid) {
    try {
      const carts = await this.getCarts();

      if (carts === -1) {
        console.log({
          status: "error",
          message: "Carts list is empty, try creating a cart first",
        });
        return -1;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        console.log({ status: "error", message: "Cart doesn't exist" });
        return -2;
      }

      const productInCart = await cartModel.findOne({
        _id: id,
        "products.product": pid,
      });

      if (!productInCart) {
        return -3;
      }

      const newCart = await cartModel.updateOne(
        { _id: id },
        { $pull: { products: { product: pid } } }
      );

      const updatedCart = await cartModel.findOne({ _id: id });

      return updatedCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async clearCartProductsById(id) {
    try {
      const carts = await this.getCarts();

      if (carts === -1) {
        console.log({
          status: "error",
          message: "Carts list is empty, try creating a cart first",
        });
        return -1;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        console.log({ status: "error", message: "Cart doesn't exist" });
        return -2;
      }

      const newCart = await cartModel.updateOne(
        { _id: id },
        { $set: { products: [] } }
      );

      const updatedCart = await cartModel.findOne({ _id: id });

      return updatedCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }
}
