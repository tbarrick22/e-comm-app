import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthForm from "../../components/AuthForm";

function Register() {
	// set up state variables
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// set up navigation functionality
	const navigate = useNavigate();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

	// handle register submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Use try catch to make call to backend
		try {
			const response = await fetch(
				"http://localhost:3000/api/users/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				}
			);
			const data = await response.json();
			// check for error in response
			if (!response.ok) {
				setError(data.message || "Registration failed");
				return;
			}

			setSuccess("Registration successful! Redirecting to login...");
			setTimeout(() => navigate("/login"), 1200);
		} catch (error) {
			setError("Network error");
		}
	};

	// prevent registering if authenticated
	if (isAuthenticated) {
		return <Navigate to="/products" />;
	}

	return (
		<>
			{error && <p className="text-red-500 mb-2">{error}</p>}
			{success && <p className="text-green-600 mb-2">{success}</p>}
			<AuthForm
				title="Register"
				username={username}
				setUsername={setUsername}
				setPassword={setPassword}
				handleSubmit={handleSubmit}
				error={error}
			/>
		</>
	);
}

export default Register;
