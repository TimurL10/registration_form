// optionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const optionsSlice = createSlice({
  name: "options",
  initialState: {
    selected: [],
    companyId: null,
    accessToken: null,
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = [];
    },
    setCompanyId: (state, action) => {
      state.companyId = action.payload;
    },
    clearCompanyId: (state) => {
      state.companyId = null;
    },
    setAccess: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
    },
  },
});

export const {
  setSelected,
  clearSelected,
  setCompanyId,
  clearCompanyId,
  setAccess,
  clearAuth,
} = optionsSlice.actions;

export default optionsSlice.reducer;
