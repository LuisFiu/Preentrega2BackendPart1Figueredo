import { Router } from "express";
import { makeid } from "../utils.js";

import { productService } from "../managers/index.js";
import productModel from "../managers/mongo/models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  const product = req.body;

  if (!product.title || !product.description || !product.price) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  const newProduct = {
    title: product.title,
    description: product.description,
    code: `${product.title.replace(/\s+/g, "")}_${makeid(6)}`,
    price: product.price,
    status: product.status,
    stock: product.stock,
    category: product.category,
  };

  if (typeof newProduct.price !== "number" || isNaN(newProduct.price)) {
    return res
      .status(400)
      .send({ status: "error", error: "Price isn't a number" });
  }

  if (newProduct.stock == null) {
    newProduct.stock = 1;
  } else {
    if (
      typeof newProduct.stock !== "number" ||
      isNaN(newProduct.stock) ||
      newProduct.stock < 0
    ) {
      return res
        .status(400)
        .send({
          status: "error",
          error: "Stock isn't a number or is a negative value",
        });
    }
  }

  if (newProduct.status == null) {
    newProduct.status = true;
  } else {
    if (typeof newProduct.status !== "boolean") {
      return res
        .status(400)
        .send({ status: "error", error: "Status isn't true or false" });
    }
  }

  if (newProduct.category == null) {
    newProduct.category = "Generic";
  } else {
    if (typeof newProduct.category !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Category isn't a Text" });
    }
  }

  // Usuario envió todo OK se procede a crear el producto

  const result = await productService.createProduct(newProduct);

  if (result === -1) {
    // Usuario envio todo OK pero no se pudo crear el producto

    return res
      .status(500)
      .send({ status: "error", error: "Couldn't create product" });
  }

  // Producto creado

  res.send({ status: "success", message: "Product Created", product: product });
});

router.get("/", async (req, res) => {
  const paginationData = await productModel.paginate(
    {},
    { page: parseInt(req.query.page) || 1, limit: 5, lean: true }
  );
  const {
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    page: currentPage,
  } = paginationData;

  let prevLink = `?page=${paginationData.prevPage}`;

  let nextLink = `?page=${paginationData.nextPage}`;

  if (paginationData.hasPrevPage === false) {
    prevLink = null;
  }

  if (paginationData.hasNextPage === false) {
    nextLink = null;
  }

  const pagination = {
    totalPages: paginationData.totalPages,
    prevPage: paginationData.prevPage,
    nextPage: paginationData.nextPage,
    page: paginationData.page,
    hasPrevPage: paginationData.hasPrevPage,
    hasNextPage: paginationData.hasNextPage,
    prevLink: prevLink,
    nextLink: nextLink,
  };

  const products = paginationData.docs;

  if (products === -1) {
    return res
      .status(500)
      .send({ status: "error", error: "Couldn't get Products" });
  } else
    return res
      .status(200)
      .send({ status: "success", payload: products, pagination });
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  const result = await productService.getProductById(productId);

  if (result === -1) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "Product list is empty, try creating a product first",
      });
  } else if (result === -2) {
    return res
      .status(400)
      .send({ status: "error", message: "Product doesn't exist" });
  } else if (result === null) {
    return res
      .status(500)
      .send({
        status: "error",
        message: "An error occurred during get Product",
      });
  }

  res.send({ status: "success", payload: result });
});

router.put("/:id", async (req, res) => {
  const productId = req.params.id;

  const updatedValues = req.body;

  console.log(`Received ID: ${productId}`);
  console.log(`Updated Values:`, updatedValues);

  if (updatedValues.title == null) {
  } else {
    if (typeof updatedValues.title !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Title isn't a Text" });
    }
  }
  if (typeof updatedValues.price !== "number" || isNaN(updatedValues.price)) {
    return res
      .status(400)
      .send({ status: "error", error: "Price isn't a number" });
  }

  if (updatedValues.stock == null) {
  } else {
    if (
      typeof updatedValues.stock !== "number" ||
      isNaN(updatedValues.stock) ||
      updatedValues.stock < 0
    ) {
      return res
        .status(400)
        .send({
          status: "error",
          error: "Stock isn't a number or is a negative value",
        });
    }
  }

  if (updatedValues.status == null) {
  } else {
    if (typeof updatedValues.status !== "boolean") {
      return res
        .status(400)
        .send({ status: "error", error: "Status isn't true or false" });
    }
  }

  if (updatedValues.category == null) {
  } else {
    if (typeof updatedValues.category !== "string") {
      return res
        .status(400)
        .send({ status: "error", error: "Category isn't a Text" });
    }
  }

  const result = await productService.editProduct(productId, updatedValues);

  if (result === -1) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "Product list is empty, try creating a product first",
      });
  } else if (result === -2) {
    return res
      .status(400)
      .send({ status: "error", message: "Product doesn't exist" });
  } else if (result === null) {
    return res
      .status(500)
      .send({
        status: "error",
        message: "An error occurred during the update",
      });
  }

  res.send({ status: "success", updatedProduct: result });
});

router.delete("/:id", async (req, res) => {
  const productId = req.params.id;

  const parsedProductId = parseInt(productId, 10);

  if (isNaN(parsedProductId)) {
    return res
      .status(400)
      .send({ status: "error", message: "Please send a valid Product ID" });
  }

  const result = await productService.deleteProduct(productId);

  if (result === -1) {
    return res
      .status(400)
      .send({
        status: "error",
        message: "Product list is empty, try creating a product first",
      });
  } else if (result === -2) {
    return res
      .status(400)
      .send({ status: "error", message: "Product doesn't exist" });
  } else if (result === null) {
    return res
      .status(500)
      .send({
        status: "error",
        message: "An error occurred during the delete",
      });
  }

  res.send({ status: "success", deletedProduct: result });
});

export default router;
