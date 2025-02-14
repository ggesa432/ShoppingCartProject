import { configureStore, combineReducers } from '@reduxjs/toolkit';
import couponReducer from './couponReducer'; // Ensure the correct path
import productReducer from './productReducer'; // If you have other reducers
import cartReducer from './cartReducer'; // If you have other reducers

// Combine all reducers
const rootReducer = combineReducers({
  coupon: couponReducer, // Include the coupon reducer
  product: productReducer,
  cart: cartReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

