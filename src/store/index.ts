import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./applicationSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
