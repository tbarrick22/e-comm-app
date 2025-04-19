import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// retrieve token and username
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

// create slice
const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: token || null,
		username: username || null,
		isAuthenticated: !!token,
	},
	reducers: {
		login: (state, action) => {
			const { token, username } = action.payload;
			state.token = token;
			state.username = username;
			state.isAuthenticated = true;
			localStorage.setItem("token", token);
			localStorage.setItem("username", username);
		},
		logout: (state) => {
			state.token = null;
			state.username = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
			localStorage.removeItem("username");
		},
	},
});

// export actions, selectors
export const { login, logout } = authSlice.actions;

// export reducer
export default authSlice.reducer;
