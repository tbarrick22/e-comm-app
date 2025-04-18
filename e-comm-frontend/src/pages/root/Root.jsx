import React from "react";
import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";

function Root() {
	return (
		<>
			<h1>Welcome to the Store</h1>
			<NavBar />
			<main>
				<Outlet />
			</main>
		</>
	);
}

export default Root;
