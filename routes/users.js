const express = require("express");
const usersRouter = express.Router();

// import controller functions
const {
	registerUser,
	loginUser,
	getUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

// TO DO: ADD AUTHENTICATION!!!
const authenticateUser = require("../middleware/auth");

// POST /register - register user
usersRouter.post("/register", registerUser);

// POST /login - login user
usersRouter.post("/login", loginUser);

// GET /:id - user by id (authenticate)
usersRouter.get("/:id", authenticateUser, getUser);

// PUT /:id - update user (authenticate)
usersRouter.put("/:id", authenticateUser, updateUser);

// DELETE /:id - delete user (authenticate)
usersRouter.delete("/:id", authenticateUser, deleteUser);

module.exports = usersRouter;
