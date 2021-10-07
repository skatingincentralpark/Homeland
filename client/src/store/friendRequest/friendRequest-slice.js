import { createSlice } from "@reduxjs/toolkit";

// @@@@ FRIENDREQUEST SLICE

// @@ INITIAL STATE
const initialState = {
  friendRequests: [],
  loading: true,
  error: {},
};

// @@ REDUCER FUNCTIONS
function getFriendRequests(state, action) {
  Object.assign(state, {
    friendRequests: action.payload,
    loading: false,
  });
}
function addFriendRequest(state, action) {
  Object.assign(state, {
    friendRequests: [action.payload, ...state.friendRequests],
    loading: false,
  });
}
function removeFriendRequest(state, action) {
  Object.assign(state, {
    friendRequests: state.friendRequests.filter(
      (request) => request._id != action.payload
    ),
    loading: false,
  });
}
function clearFriendRequests(state, action) {
  Object.assign(state, {
    friendRequests: [],
    loading: true,
  });
}
function friendRequestError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
  });
}

// @@ AUTH REDUCERS
const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState: initialState,
  reducers: {
    getFriendRequests,
    addFriendRequest,
    acceptFriendRequest: removeFriendRequest,
    declineFriendRequest: removeFriendRequest,
    removeFriendRequest: removeFriendRequest,
    clearFriendRequests,
    friendRequestError,
  },
});

export const friendRequestActions = friendRequestSlice.actions;
export default friendRequestSlice.reducer;
