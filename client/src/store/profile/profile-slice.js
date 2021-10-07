import { createSlice } from "@reduxjs/toolkit";

// @@@@ PROFILE SLICE

// @@ INITIAL STATE
const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
};

// @@ REDUCER FUNCTIONS
function getProfile(state, action) {
  Object.assign(state, {
    profile: action.payload,
    loading: false,
  });
}
function getProfiles(state, action) {
  Object.assign(state, {
    profiles: action.payload,
    loading: false,
  });
}
function profileError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
    profile: null,
  });
}
function clearProfile(state, action) {
  Object.assign(state, {
    profile: null,
    loading: true,
  });
}
function loadFriends(state, action) {
  Object.assign(state, {
    ...state,
    friends: action.payload,
  });
}

// @@ PROFILE REDUCER
const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    getProfile,
    profileError,
    clearProfile,
    loadFriends,
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
