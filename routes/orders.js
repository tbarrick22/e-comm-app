const express = require("express");
const ordersRouter = express.Router();
// import controller functions
const {
	getOrders,
	getOrderById,
	placeOrder,
} = require("../controllers/orderController");

// TO DO: ADD AUTHENTICATION!!!
const authenticateUser = require("../middleware/auth");

// GET /:username - get orders (authenticate)
ordersRouter.get("/:username", authenticateUser, getOrders);

// GET /:username/:orderId - get order (authenticate)
ordersRouter.get("/:username/:orderId", authenticateUser, getOrderById);

// POST /:username - place order (authenticate)
ordersRouter.post("/:username", authenticateUser, placeOrder);

// DELTE /:userId/:orderId - delete order (authenticate)
// cartsRouter.delete("/:username", authenticateUser, cancelOrder);

module.exports = ordersRouter;
