import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Root from "./pages/root/Root";
import Cart from "./pages/cart/Cart";
import Products from "./pages/products/Products";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { isTokenExpired } from "./utils/isTokenExpired";
import { useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
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
			<Route
				path="/orders/:orderId"
				element={
					<ProtectedRoute>
						<OrderDetails />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Route>
	)
);

function App() {
	const dispatch = useDispatch();
	// set up useEffect to create timer which checks if user is logged in
	useEffect(() => {
		const interval = setInterval(() => {
			const token = localStorage.getItem("token");

			if (token && isTokenExpired(token)) {
				dispatch(logout());
			}
		}, 60 * 1000); // check every 60 seconds

		return () => clearInterval(interval); // cleanup on unmount
	}, [dispatch]);

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
