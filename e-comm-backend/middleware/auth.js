// Checks if user is authenticated using JWT
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
	const token = req.header("Authorization");

	// No token - deny access
	if (!token) {
		return res.status(401).json({ message: "Access denied" });
	}

	// if there is a token, try to verify and if verify, pass on to next middleware
	try {
		const decoded = jwt.verify(
			token.replace("Bearer ", ""),
			process.env.JWT_SECRET
		);
		req.user = decoded; // attach user info to request
		next();
	} catch (error) {
		res.status(400).json({ message: "Invalid token" });
	}
};

module.exports = authenticateUser;
