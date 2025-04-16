const pool = require("../db/db");

// get users order by username
const getOrders = async (req, res, next) => {
	// get username from req params
	const username = req.params.username;
	// get the user id from the request
	const userId = req.user.id;
	// Check the logged-in user is only trying to see their own orders
	if (req.user.username !== username) {
		return res
			.status(403)
			.json({ message: "You can only view your own orders" });
	}
	if (!userId) {
		return res
			.status(403)
			.json({ message: "You need a user ID to view orders" });
	}
	try {
		const result = await pool.query(
			"SELECT * FROM orders WHERE user_id = $1",
			[userId]
		);
		if (result.rows.length === 0) {
			return res.json({ message: "No orders yet" });
		}
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching orders", error });
	}
};

// get specific order by order id
const getOrderById = async (req, res, next) => {
	// 1. get username and orderId from req params
	const { username, orderId } = req.params;
	// 2. get the user id from the request
	const userId = req.user.id;
	// 3. Check the logged-in user is only trying to see their own orders
	if (req.user.username !== username) {
		return res
			.status(403)
			.json({ message: "You can only view your own orders" });
	}
	if (!userId) {
		return res
			.status(403)
			.json({ message: "You need a user ID to view orders" });
	}
	// 4. Try to get order details
	try {
		const result = await pool.query(
			`SELECT
                products.id AS product_id,
                products.name,
                products.price,
                orders_products.quantity,
                orders.date
            FROM orders
            JOIN orders_products ON orders.id = orders_products.order_id
            JOIN products ON orders_products.product_id = products.id
            WHERE orders_products.order_id = $1`,
			[orderId]
		);
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching order by ID", error });
	}
};

// place an order
const placeOrder = async (req, res, next) => {
	// 1. get username  from req params
	const { username } = req.params;
	// 2. get the user id from the request
	const userId = req.user.id;
	// 3. Check the logged-in user is only trying to see their own orders
	if (req.user.username !== username) {
		return res
			.status(403)
			.json({ message: "You can only place orders for yourself" });
	}
	if (!userId) {
		return res
			.status(403)
			.json({ message: "You need a user ID to place orders" });
	}
	try {
		// 4. Check if user has a cart
		const cartResult = await pool.query(
			"SELECT id FROM carts WHERE user_id = $1",
			[userId]
		);
		if (cartResult.rows.length === 0) {
			return res
				.status(400)
				.json({ message: "No cart found for this user" });
		}
		const cartId = cartResult.rows[0].id;
		// 5. Create a new order
		const orderResult = await pool.query(
			"INSERT INTO orders (user_id) VALUES ($1) RETURNING id, user_id, date",
			[userId]
		);
		const orderId = orderResult.rows[0].id;
		// 6. Move cart products to order products
		await pool.query(
			`INSERT INTO orders_products (order_id, product_id, quantity)
            SELECT $1 AS order_id, product_id, quantity FROM carts_products WHERE cart_id = $2`,
			[orderId, cartId]
		);
		// 7. Clear cart
		await pool.query("DELETE FROM carts WHERE id = $1", [cartId]);
		res.status(201).json({ message: "Order placed successfully", orderId });
	} catch (error) {
		console.error("Error placing order:", error);
		res.status(500).json({ message: "Server error while placing order" });
	}
};

// cancel an order - Not really needed but could implement later
// const cancelOrder = async (req, res, next) => {};

module.exports = { getOrders, getOrderById, placeOrder };
