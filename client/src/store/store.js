// store.js
import { configureStore } from "@reduxjs/toolkit";
import optionsReducer from "./optionsSlice.js";

export const store = configureStore({
  reducer: {
    options: optionsReducer,
  },
});
