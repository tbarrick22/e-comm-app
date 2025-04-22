import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Cart() {
	// Initialize state
	const [cartItems, setCartItems] = useState([]);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	// get token and username from store
	const { token, username } = useSelector((state) => state.auth);
	// implement useEffect to get cart items
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/carts/${username}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await response.json();
				// check for error
				if (!response.ok) {
					setError(data.message || "Failed to fetch cart");
					return;
				}
				setCartItems(data);
			} catch (err) {
				setError("Error fetching cart: " + err.message);
			}
		};
		fetchCart();
	}, [token, username]);

	// handle remove
	const handleRemoveItem = async (itemName) => {
		try {
			const response = await fetch(
				`${
					import.meta.env.VITE_API_BASE_URL
				}/carts/${username}/${itemName}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// error check
			if (!response.ok) {
				const data = await response.json();
				setError(data.message || "Failed to remove item");
				return;
			}
			// update cartItems since no error
			setCartItems((prev) =>
				prev.filter((item) => item.name !== itemName)
			);
		} catch (err) {
			setError("Error removing item" + err.message);
		}
	};

	// Handle clear cart
	const handleClearCart = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/${username}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// error check
			if (!response.ok) {
				const data = await response.json();
				setError(data.message || "Failed to clear cart");
				return;
			}

			setCartItems([]);
			setMessage("Cart cleared.");
		} catch (err) {
			setError("Error clearing cart" + err.message);
		}
	};

	// handle place order
	const handlePlaceOrder = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/orders/${username}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// error check
			if (!response.ok) {
				const data = await response.json();
				setError(data.message || "Failed to place order");
				return;
			}
			setCartItems([]);
			setMessage("Order placed successfully!");
		} catch (err) {
			setError("Error clearing cart" + err.message);
		}
	};

	// Calculate total cost
	const totalCost = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	return (
		<div className="cart-container">
			<h2>Your Cart</h2>

			{error && <p className="text-red-500">{error}</p>}
			{message && <p className="text-green-600">{message}</p>}

			{cartItems.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<>
					<ul className="cart-list">
						{cartItems.map((item) => (
							<li key={item.id} className="cart-item">
								<div>
									<strong>{item.name}</strong> - ${item.price}{" "}
									x {item.quantity}
								</div>
								<button
									className="remove-button"
									onClick={() => handleRemoveItem(item.name)}
								>
									Remove
								</button>
							</li>
						))}
					</ul>

					<div className="total-cost mt-4">
						<strong>Total:</strong> ${totalCost.toFixed(2)}
					</div>

					<div className="cart-actions mt-4 space-x-4">
						<button
							className="clear-cart-button bg-red-500 text-white p-2 rounded"
							onClick={handleClearCart}
						>
							Clear Cart
						</button>
						<button
							className="place-order-button bg-green-600 text-white p-2 rounded"
							onClick={handlePlaceOrder}
						>
							Place Order
						</button>
					</div>
				</>
			)}
			<h4>Signed in as {username}</h4>
		</div>
	);
}

export default Cart;
