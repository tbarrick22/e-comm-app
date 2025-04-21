import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
	try {
		const { exp } = jwtDecode(token);
		return Date.now() >= exp * 1000; // maybe token is invalid but expired
	} catch {
		return true; // couldnt decode token is invalid
	}
};
