/**
 * Redux store configuration for the application
 * Configures the Redux store with RTK Query middleware and search API integration
 * @module store/store
 * @author Margarita Kattsyna
 */

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { searchApi } from "./api/searchApi.ts";

/**
 * Redux store configuration with RTK Query integration
 * Creates and configures the main Redux store with search API reducer and middleware
 * @see {@link searchApi} - RTK Query API slice for search functionality
 */
export const store = configureStore({
    reducer: {
        [searchApi.reducerPath]: searchApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(searchApi.middleware),
});

/**
 * Setup RTK Query listeners for automatic cache management
 * Enables automatic cache invalidation and refetching based on dispatched actions
 * @see {@link store} - The configured Redux store
 */
setupListeners(store.dispatch);

/**
 * Type definitions for the Redux store
 * Provides TypeScript types for store state and dispatch
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
