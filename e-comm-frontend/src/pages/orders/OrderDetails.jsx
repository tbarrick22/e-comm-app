import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function OrderDetails() {
	const [details, setDetails] = useState([]);
	const [error, setError] = useState("");
	const { orderId } = useParams();
	const { token, username } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/orders/${username}/${orderId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				// get JSON data
				const data = await response.json();
				// error check
				if (!response.ok) {
					setError(data.message || "Failed to fetch order details");
					return;
				}
				// otherwise set the details
				setDetails(data);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchOrderDetails();
	}, [token, username, orderId]);

	const handleBack = () => {
		navigate("/orders");
	};

	// render error in case one exists
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="details-container">
			<h2 className="details-title">Order #{orderId} Details</h2>
			{details.length === 0 ? (
				<p>No details found for this order.</p>
			) : (
				<ul className="details-list">
					{details.map((item, index) => (
						<li key={index} className="detail-item">
							<p>
								<strong>Product:</strong> {item.name}
							</p>
							<p>
								<strong>Price:</strong> ${item.price}
							</p>
							<p>
								<strong>Quantity:</strong> {item.quantity}
							</p>
							<p>
								<strong>Order Date:</strong>{" "}
								{new Date(item.date).toLocaleDateString()}
							</p>
						</li>
					))}
				</ul>
			)}
			<button onClick={handleBack}>← Back to Orders</button>
			<h4>Signed in as {username}</h4>
		</div>
	);
}

export default OrderDetails;
