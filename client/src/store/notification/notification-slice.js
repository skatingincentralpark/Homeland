import { createSlice } from "@reduxjs/toolkit";

// @@@@ NOTIFICATION SLICE

// @@ INITIAL STATE
const initialState = {
  notifications: [],
  loading: true,
};

// @@ REDUCER FUNCTIONS
function getNotifications(state, action) {
  Object.assign(state, {
    notifications: action.payload,
    loading: false,
  });
}
function notificationError(state, action) {
  Object.assign(state, {
    notifications: null,
    loading: true,
  });
}

// @@ AUTH REDUCERS
const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    getNotifications: getNotifications,
    readNotifications: getNotifications,
    notificationError: notificationError,
    clearNotifications: notificationError,
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
