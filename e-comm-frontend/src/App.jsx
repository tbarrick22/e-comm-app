import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Root from "./pages/root/Root";
import Cart from "./pages/cart/Cart";
import Products from "./pages/products/Products";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Orders from "./pages/orders/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
	NavLink, // ADD THIS TO COMPONENTS
} from "react-router-dom";

// create a router
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Root />}>
			<Route path="/products" element={<Products />} />
			<Route path="/login" element={<Login />} />{" "}
			{/* MAKE CONNECTED WITH REGISTER*/}
			<Route path="/register" element={<Register />} />{" "}
			{/* MAKE CONNECTED WITH LOGIN*/}
			<Route
				path="/cart"
				element={
					<ProtectedRoute>
						<Cart />
					</ProtectedRoute>
				}
			/>{" "}
			{/* ONLY AVAILABLE WHEN LOGGED IN*/}
			<Route
				path="/orders"
				element={
					<ProtectedRoute>
						<Orders />
					</ProtectedRoute>
				}
			/>{" "}
			{/* ONLY AVAILABLE WHEN LOGGED IN*/}
		</Route>
	)
);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
