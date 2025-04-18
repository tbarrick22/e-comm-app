import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// create slice
const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: [],
	},
	reducers: {
		setCart: (state, action) => {
			state.items = action.payload;
		},
		addToCart: (state, action) => {
			state.items.push(action.payload);
		},
		removeFromCart: (state, action) => {
			state.items = state.items.filter(
				(item) => item.name !== action.payload
			);
		},
		clearCart: (state) => {
			state.items = [];
		},
	},
});

// export actions, selectors
export const { setCart, addToCart, removeFromCart, clearCart } =
	cartSlice.actions;

// export reducer
export default cartSlice.reducer;
