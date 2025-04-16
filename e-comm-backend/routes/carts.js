const express = require("express");
const cartsRouter = express.Router();

// import controller functions
const {
	getCart,
	addToCart,
	removeCartItem,
	clearCart,
} = require("../controllers/cartController");

// TO DO: ADD AUTHENTICATION!!!
const authenticateUser = require("../middleware/auth");

// GET /:username - get user cart (authenticate)
cartsRouter.get("/:username", authenticateUser, getCart);

// POST /:username - add to cart (authenticate)
cartsRouter.post("/:username", authenticateUser, addToCart);

// DELETE /:username/:itemName  - remove cart item (authenticate)
cartsRouter.delete("/:username/:itemName", authenticateUser, removeCartItem);

// DELETE /:username  - clear cart (authenticate)
cartsRouter.delete("/:username", authenticateUser, clearCart);

module.exports = cartsRouter;
