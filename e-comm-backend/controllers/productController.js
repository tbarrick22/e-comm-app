const pool = require("../db/db");

const getProducts = async (req, res, next) => {
	try {
		const result = await pool.query("SELECT * FROM products");
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching products" });
	}
};

const getProductByName = async (req, res, next) => {
	// get the product id from the req params - ALSO can get product by name!
	const productName = req.params.name;
	// console.log(productName);
	try {
		const result = await pool.query(
			"SELECT * FROM products WHERE name = $1",
			[productName]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ message: "Error fetching product" });
	}
};

module.exports = { getProducts, getProductByName };
