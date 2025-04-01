const express = require("express");
const cartsRouter = express.Router();

// import controller functions
const { getCart, addToCart } = require("../controllers/cartController");

// TO DO: ADD AUTHENTICATION!!!
const authenticateUser = require("../middleware/auth");

// GET /:username - get user cart (authenticate)
cartsRouter.get("/:username", authenticateUser, getCart);

// POST /:username - add to cart (authenticate)
cartsRouter.post("/:username", authenticateUser, addToCart);

// PUT /:username/:itemName - update cart item (authenticate)

// DELETE /:username/:itemName  - remove cart item (authenticate)

// DELETE /:username  - clear cart (authenticate)

module.exports = cartsRouter;
