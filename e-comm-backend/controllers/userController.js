// import database to use in models
const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// TEST CODE BELOW:
// Function to get all users
// const getAllUsers = async () => {
// 	const result = await pool.query("SELECT * FROM users");
// 	return result.rows;
// };

// TEST CODE TO VERIFY CONNECTION
// const usersResponse = async () => {
// 	try {
// 		const users = await getAllUsers();
// 		console.log(users);
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

// usersResponse();

// PROD CODE BELOW:
// registerUser()
const registerUser = async (req, res, next) => {
	// Log request body to check if it's being parsed correctly
	// console.log("Received request body:", req.body);
	// Check if user is already logged in (has a token)
	if (req.user) {
		return res.status(400).json({ message: "You are already logged in" });
	}
	// second check for already logged in:
	const tokenCheck = req.header("Authorization");
	if (tokenCheck) {
		// Try to verify token
		try {
			jwt.verify(
				tokenCheck.replace("Bearer ", ""),
				process.env.JWT_SECRET
			);
			return res
				.status(400)
				.json({ message: "You are already logged in" });
		} catch (error) {
			// Token is invalid or expired, proceed with registration
		}
	}
	// get sign in credentials from request body
	const { username, password } = req.body;
	// Validate that all fields are provided
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const result = await pool.query(
			"INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
			[username, hashedPassword]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ message: "Error registering user" });
	}
};

// loginUser()
const loginUser = async (req, res, next) => {
	// Check if user is already logged in (has a token)
	if (req.user) {
		return res.status(400).json({ message: "You are already logged in" });
	}
	// second check for already logged in:
	const tokenCheck = req.header("Authorization");
	if (tokenCheck) {
		// Try to verify token
		try {
			jwt.verify(
				tokenCheck.replace("Bearer ", ""),
				process.env.JWT_SECRET
			);
			return res
				.status(400)
				.json({ message: "You are already logged in" });
		} catch (error) {
			// Token is invalid or expired, proceed with registration
		}
	}
	// get sign in credentials from request body
	const { username, password } = req.body;

	try {
		const user = await pool.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);
		// check if any user came back matching the username
		if (user.rows.length === 0) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// validate password
		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].password
		);
		if (!validPassword) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		// create login token if password is valid
		const token = jwt.sign(
			{ id: user.rows[0].id, username: user.rows[0].username }, // ADD USERNAME HERE!
			process.env.JWT_SECRET,
			{ expiresIn: "1hr" }
		);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: "Login error" });
	}
};

// getUser()
const getUser = async (req, res, next) => {
	// get the user id from the req params
	const userId = req.params.id;
	// Check the logged-in user is trying to only access their own data
	if (req.user.id !== parseInt(userId)) {
		return res
			.status(403)
			.json({ message: "You can only access your own data" });
	}
	try {
		const result = await pool.query(
			"SELECT id, username FROM users WHERE id = $1",
			[userId]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(result.rows[0]);
	} catch (error) {
		return res.status(500).json({ message: "Error retrieving user" });
	}
};

// updateUser()
const updateUser = async (req, res, next) => {
	// get the user id from the req params and values from query body
	const userId = req.params.id;
	const { username, password } = req.body;

	// Check the logged-in user is trying to only access their own data
	if (req.user.id !== parseInt(userId)) {
		return res
			.status(403)
			.json({ message: "You can only access your own data" });
	}

	try {
		// check if the user exists
		const userCheck = await pool.query(
			"SELECT * FROM users WHERE id = $1",
			[userId]
		);
		if (userCheck.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}
		// hash new password if provided - otherwise keep existing pass
		let hashedPassword = userCheck.rows[0].password;
		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}

		// Update user details
		const result = await pool.query(
			"UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username",
			[username || userCheck.rows[0].username, hashedPassword, userId]
		);
		res.json(result.rows[0]);
	} catch (error) {
		res.status(500).json({ message: "Error updating user" });
	}
};

// deleteUser()
const deleteUser = async (req, res, next) => {
	const userId = req.params.id;

	// Check the logged-in user is trying to only access their own data
	if (req.user.id !== parseInt(userId)) {
		return res
			.status(403)
			.json({ message: "You can only access your own data" });
	}

	try {
		// check if the user exists
		const userCheck = await pool.query(
			"SELECT * FROM users WHERE id = $1",
			[userId]
		);
		if (userCheck.rows.length === 0) {
			return res.status(404).json({ message: "User not found" });
		}

		// delete user
		await pool.query("DELETE FROM users WHERE id = $1", [userId]);
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting user" });
	}
};

module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser };
