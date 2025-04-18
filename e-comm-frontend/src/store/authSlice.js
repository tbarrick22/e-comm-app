import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// retrieve token
const token = localStorage.getItem("token");

// create slice
const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: token || null,
		isAuthenticated: !!token,
	},
	reducers: {
		login: (state, action) => {
			state.token = action.payload;
			state.isAuthenticated = true;
			localStorage.setItem("token", action.payload);
		},
		logout: (state) => {
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
		},
	},
});

// export actions, selectors
export const { login, logout } = authSlice.actions;

// export reducer
export default authSlice.reducer;
