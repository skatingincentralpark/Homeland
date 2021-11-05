import { createSlice } from "@reduxjs/toolkit";

// @@@@ PROFILE SLICE

// @@ INITIAL STATE
const initialState = {
  profile: null,
  photos: [],
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
function getPhotos(state, action) {
  Object.assign(state, {
    photos: action.payload,
  });
}
function profileError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
    profile: null,
  });
}
function profileLoading(state, action) {
  if (action.payload === state.profile?.user._id) {
    return;
  }
  Object.assign(state, {
    ...state,
    loading: true,
  });
}
function clearProfile(state, action) {
  Object.assign(state, {
    profile: null,
    loading: true,
    photos: [],
    profiles: [],
    error: {},
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
    getPhotos,
    profileLoading,
    profileError,
    clearProfile,
    loadFriends,
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
