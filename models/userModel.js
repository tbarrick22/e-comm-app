// import database to use in models
const pool = require("../db/db");

// Function to get all users
const getAllUsers = async () => {
	const result = await pool.query("SELECT * FROM users");
	return result.rows;
};

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

module.exports = { getAllUsers };
