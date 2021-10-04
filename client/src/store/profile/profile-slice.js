import { createSlice } from "@reduxjs/toolkit";

// @@@@ PROFILE SLICE

// @@ INITIAL STATE
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
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
    repos: [],
    loading: true,
  });
}

// @@ PROFILE REDUCER
const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    getProfile: getProfile,
    profileError: profileError,
    clearProfile: clearProfile,
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
