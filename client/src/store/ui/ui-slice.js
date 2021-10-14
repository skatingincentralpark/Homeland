import { createSlice } from "@reduxjs/toolkit";

// UI slice
const initialState = {
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    loadingTrue(state, action) {
      state.loading = true;
    },
    loadingFalse(state, action) {
      state.loading = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
