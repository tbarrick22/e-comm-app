import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const NavBar = () => {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate("/");
	};
	return (
		<div className="navigation">
			<NavLink to="/products">Products</NavLink>
			{!isAuthenticated ? (
				<>
					<NavLink to="/login">Login</NavLink>
					<NavLink to="/register">Register</NavLink>
				</>
			) : (
				<>
					<NavLink to="/cart">Cart</NavLink>
					<NavLink to="/orders">Orders</NavLink>
					<button onClick={handleLogout}>Logout</button>
				</>
			)}
		</div>
	);
};

export default NavBar;
