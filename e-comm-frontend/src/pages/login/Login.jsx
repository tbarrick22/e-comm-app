import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "../../store/authSlice";
import AuthForm from "../../components/AuthForm";

function Login() {
	// Set state variables for username, password, and email
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// set up navigation functionality, set up useSelector and useDispatch
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

	// create function to handle login submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Use try catch to make call to backend
		try {
			const response = await fetch(
				"http://localhost:3000/api/users/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				}
			);
			// check for error in response
			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || "Login failed");
				return;
			}
			// if no error in response data
			const data = await response.json();
			const token = data.token;
			// decode token to extract username
			const decoded = jwtDecode(token);
			const usernameFromToken = decoded.username;
			// login with token
			dispatch(login({ token, username: usernameFromToken }));
			navigate("/products");
		} catch (error) {
			setError("Network error");
		}
	};

	// redirect in case already logged in
	if (isAuthenticated) {
		return <Navigate to="/products" />;
	}

	return (
		<>
			<h2>Login</h2>
			<AuthForm
				title="Login"
				username={username}
				setUsername={setUsername}
				setPassword={setPassword}
				handleSubmit={handleSubmit}
				error={error}
			/>
		</>
	);
}

export default Login;
