const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Import routers and set up routing
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/api", (req, res, next) => {
	res.send("Hello World!");
});

app.listen(PORT, () => {
	console.log(`E-comm backend app listening on port ${PORT}`);
});
