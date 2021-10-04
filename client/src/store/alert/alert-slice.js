import { createSlice } from "@reduxjs/toolkit";

// ALERT slice
const initialAlertSlice = [];

const alertSlice = createSlice({
  name: "alert",
  initialState: initialAlertSlice,
  reducers: {
    setAlert(state, action) {
      return [...state, action.payload];
    },
    removeAlert(state, action) {
      return state.filter((alert) => alert.id !== action.payload);
    },
  },
});

export const alertActions = alertSlice.actions;
export default alertSlice.reducer;
