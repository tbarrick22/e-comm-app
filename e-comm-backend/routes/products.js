const express = require("express");
const productsRouter = express.Router();

// Import controller functions
const {
	getProducts,
	getProductByName,
} = require("../controllers/productController");

// GET / - get products
productsRouter.get("/", getProducts);

// GET /:id - product by NAME (authenticate) - no auth needed
productsRouter.get("/:name", getProductByName);

module.exports = productsRouter;
