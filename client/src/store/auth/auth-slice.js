import { createSlice } from "@reduxjs/toolkit";

// @@@@ AUTH SLICE

// @@ INITIAL STATE
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// @@ REDUCER FUNCTIONS
function authError(state, action) {
  localStorage.removeItem("token");
  Object.assign(state, {
    token: null,
    isAuthenticated: false,
    loading: false,
    user: null,
  });
}
function authSuccess(state, action) {
  localStorage.setItem("token", action.payload.token);
  Object.assign(state, {
    token: action.payload.token,
    isAuthenticated: true,
    loading: false,
  });
}
function userLoaded(state, action) {
  Object.assign(state, {
    isAuthenticated: true,
    loading: false,
    user: action.payload,
  });
}
function loadingTrue(state, action) {
  Object.assign(state, {
    loading: true,
  });
}
function loadingFalse(state, action) {
  Object.assign(state, {
    loading: false,
  });
}
// @@ AUTH REDUCERS
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    userLoaded: userLoaded,
    updateSuccess: authSuccess,
    registerSuccess: authSuccess,
    loginSuccess: authSuccess,
    registerFail: authError,
    logout: authError,
    loginFail: authError,
    authError: authError,
    accountDeleted: authError,
    loadingTrue,
    loadingFalse,
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
