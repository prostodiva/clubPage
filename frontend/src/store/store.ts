import { configureStore} from "@reduxjs/toolkit";
import { searchApi} from "./api/searchApi.ts";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [searchApi.reducerPath]: searchApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(searchApi.middleware),
});

setupListeners(store.dispatch);
