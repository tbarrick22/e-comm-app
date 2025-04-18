import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

// set up store
export default configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
	},
});
