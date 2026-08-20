/** @format */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import activeRideReducer from "./slices/activeRideSlice";
import { conversationApi } from "./api/conversationApi";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		activeRide: activeRideReducer,
		[conversationApi.reducerPath]: conversationApi.reducer
	},
	// Middleware requis par RTK Query pour le cache, le refetch, etc.
	// (identique au principe du index.js exemple).
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(conversationApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;