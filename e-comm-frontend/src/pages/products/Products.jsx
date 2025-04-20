import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
function Products() {
	// set up state variables
	const [products, setProducts] = useState([]);
	const [quantities, setQuantities] = useState({});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	// get token and username
	const { token, username } = useSelector((state) => state.auth);
	const isAuthenticated = !!token;

	// fetch products on load
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch(
					"http://localhost:3000/api/products"
				);
				const data = await response.json();
				if (!response.ok) {
					setError(data.message || "Failed to fetch products");
					return;
				}
				setProducts(data);
				// Initialize quantities to 1
				const initialQuantities = {};
				data.forEach((product) => {
					initialQuantities[product.name] = 1;
				});
				setQuantities(initialQuantities);
			} catch (err) {
				setError(err.message);
			}
		};
		fetchProducts();
	}, []);

	// handle quantity change
	const handleQuantityChange = (productName, newQty) => {
		setQuantities((prev) => ({
			...prev,
			[productName]: parseInt(newQty),
		}));
	};

	// handle add to cart
	const handleAddToCart = async (productName) => {
		const quantity = quantities[productName];
		try {
			const response = await fetch(
				`http://localhost:3000/api/carts/${username}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ productName, quantity }),
				}
			);
			const data = await response.json();
			if (!response.ok) {
				setError(data.message || "Failed adding to cart");
				return;
			}
			// success
			setSuccess(`Added to cart: ${productName}`);
			setTimeout(() => setSuccess(""), 1200);
			// reset quantity back to 1
			setQuantities((prev) => ({
				...prev,
				[productName]: 1,
			}));
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="products-container">
			<h2 className="text-xl font-bold mb-4">Available Products</h2>

			{error && <p className="text-red-500 mb-2">{error}</p>}
			{success && <p className="text-green-500 mb-2">{success}</p>}

			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((product) => (
					<li
						key={product.id}
						className="border rounded p-4 shadow-sm flex flex-col gap-2"
					>
						<h3 className="text-lg font-semibold">
							{product.name}
						</h3>
						<p>Price: ${Number(product.price).toFixed(2)}</p>

						{isAuthenticated && (
							<>
								<div className="flex items-center gap-2">
									<label htmlFor={`qty-${product.name}`}>
										Qty:
									</label>
									<input
										id={`qty-${product.name}`}
										type="number"
										min="1"
										value={quantities[product.name] || 1}
										onChange={(e) =>
											handleQuantityChange(
												product.name,
												e.target.value
											)
										}
										className="w-16 p-1 border rounded"
									/>
								</div>

								<button
									onClick={() =>
										handleAddToCart(product.name)
									}
									className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2"
								>
									Add to Cart
								</button>
							</>
						)}
					</li>
				))}
			</ul>
			{isAuthenticated ? (
				<h4>Signed in as {username}</h4>
			) : (
				<h4>Sign in to add items to cart and place an order</h4>
			)}
		</div>
	);
}

export default Products;
