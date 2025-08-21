/**
 * @fileOverview Redux store configuration for the application
 * @description Configures the Redux store with RTK Query middleware and search API intergation
 * @module store/store
 * @author Margarita Kattsyna
 * @version 1.0.0
 * */
import { configureStore} from "@reduxjs/toolkit";
import { searchApi} from "./api/searchApi.ts";
import {setupListeners} from "@reduxjs/toolkit/query";

/**
 * Redux store configuration with RTK Query integration
 * @description Creates and configures the main Redux store with search API reducer and middleware
 * @type {import('@reduxjs/toolkit').Store}
 *
 * @see {@link searchApi} - RTK Query API slice for search functionality
 * @see {@link setupListeners} - RTK Query listener setup for cache management
 * */
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
 * @description Enables automatic cache invalidation and refetching based on dispatched actions
 * @see {@link store} - The configured Redux store
 */
setupListeners(store.dispatch);
