// optionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const optionsSlice = createSlice({
  name: "options",
  initialState: {
    selected: [],
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = [];
    },
  },
});

export const { setSelected, clearSelected } = optionsSlice.actions;
export default optionsSlice.reducer;
