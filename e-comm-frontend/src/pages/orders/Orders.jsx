import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Orders() {
	// set up state variables
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState("");
	// get token and username from store
	const { token, username } = useSelector((state) => state.auth);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/orders/${username}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				// get data:
				const data = await response.json();
				// check for error in response
				if (!response.ok) {
					setError(data.message || "Login failed");
					return;
				}
				setOrders(Array.isArray(data) ? data : []);
				// console.log(data);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchOrders();
	}, [token, username]);

	// render error in case one exists
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="orders-container">
			<h2 className="orders-title">Your Orders</h2>
			{orders.length === 0 ? (
				<p>No orders yet.</p>
			) : (
				<ul className="orders-list">
					{orders.map((order) => (
						<li key={order.id}>
							<Link
								to={`/orders/${order.id}`}
								className="order-item"
							>
								Order #{order.id} -{" "}
								{new Date(order.date).toLocaleDateString()}
							</Link>
						</li>
					))}
				</ul>
			)}
			<h4>Signed in as {username}</h4>
		</div>
	);
}

export default Orders;
