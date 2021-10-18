import { createSlice } from "@reduxjs/toolkit";

// @@@@ MESSENGER SLICE

// @@ INITIAL STATE
const initialState = {
  conversations: [],
  conversation: null,
  messages: null,
  loading: true,
  onlineUsers: [],
  error: {},
};

// @@ REDUCER FUNCTIONS
function getConversations(state, action) {
  Object.assign(state, {
    conversations: action.payload,
    loading: false,
  });
}
function getConversation(state, action) {
  Object.assign(state, {
    ...state,
    conversation: state.conversations.find(
      (c) => c._id === action.payload.conversationId
    ),
    messages: action.payload.messages,
    loading: false,
  });
}
function sendMessage(state, action) {
  Object.assign(state, {
    ...state,
    messages: [...state.messages, action.payload],
    loading: false,
  });
}
function setOnlineUsers(state, action) {
  Object.assign(state, {
    ...state,
    onlineUsers: action.payload,
    loading: false,
  });
}
function messengerError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
  });
}

// @@ MESSENGER REDUCERS
const messengerSlice = createSlice({
  name: "messenger",
  initialState: initialState,
  reducers: {
    getConversations,
    getConversation,
    sendMessage: sendMessage,
    receiveMessage: sendMessage,
    setOnlineUsers,
    messengerError,
  },
});

export const messengerActions = messengerSlice.actions;
export default messengerSlice.reducer;
