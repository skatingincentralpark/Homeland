import { createSlice } from "@reduxjs/toolkit";

// @@@@ MESSENGER SLICE

// @@ INITIAL STATE
const initialState = {
  conversations: [],
  displayedConversations: [],
  unreadCount: 0,
  conversation: null,
  messages: null,
  loading: true,
  onlineUsers: [],
  arrivalMessage: null,
  error: {},
};

// @@ REDUCER FUNCTIONS
function getConversations(state, action) {
  Object.assign(state, {
    conversations: action.payload,
    loading: false,
  });
}
function getDisplayedConversations(state, action) {
  Object.assign(state, {
    displayedConversations: action.payload,
    loading: false,
  });
}
function getUnreadCount(state, action) {
  Object.assign(state, {
    unreadCount: action.payload,
    loading: false,
  });
}
function getConversation(state, action) {
  const convIndex = state.conversations.findIndex(
    (conv) => conv._id == action.payload.conversationId
  );

  state.conversations.splice(convIndex, 1, action.payload.conversation);

  Object.assign(state, {
    conversation: action.payload.conversation,
    messages: action.payload.messages,
    loading: false,
  });
}
function sendMessage(state, action) {
  const updatedConvItem = state.conversations.find(
    (conv) => conv._id == action.payload.conversationId
  );

  Object.assign(state, {
    messages: [...state.messages, action.payload],
    conversation: updatedConvItem,
    loading: false,
  });
}
function getNextBatchMsgs(state, action) {
  Object.assign(state, {
    messages: [...state.messages, ...action.payload],
    loading: false,
  });
}
function receiveMessage(state, action) {
  const updatedConvItem = state.conversations.find(
    (conv) => conv._id == action.payload.conversationId
  );

  Object.assign(state, {
    messages: [...state.messages, action.payload],
    conversation: updatedConvItem,
    loading: false,
  });
}
function updateConversations(state, action) {
  const updatedConv = state.conversations.find(
    (conv) => conv._id == action.payload.conversationId
  );

  updatedConv.latestMessage = action.payload.text;
  updatedConv.unread = action.payload.receiverId;
  updatedConv.updatedAt = Date.now();

  Object.assign(state, {
    conversations: [
      ...state.conversations.filter(
        (conv) => conv._id !== action.payload.conversationId
      ),
      updatedConv,
    ],
    loading: false,
  });
}
function updateConversationsUnread(state, action) {
  const updatedConv = state.conversations.find(
    (conv) => conv._id == action.payload.conversationId
  );

  updatedConv.latestMessage = action.payload.text;
  updatedConv.updatedAt = Date.now();

  Object.assign(state, {
    conversations: [
      ...state.conversations.filter(
        (conv) => conv._id !== action.payload.conversationId
      ),
      updatedConv,
    ],
    loading: false,
  });
}
function setOnlineUsers(state, action) {
  Object.assign(state, {
    onlineUsers: action.payload,
    loading: false,
  });
}
function setArrivalMessage(state, action) {
  Object.assign(state, {
    arrivalMessage: action.payload,
    loading: false,
  });
}
function clearArrivalMessage(state, action) {
  Object.assign(state, {
    arrivalMessage: null,
    loading: false,
  });
}
function messengerError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
  });
}
function clearConversation(state, action) {
  Object.assign(state, {
    conversation: null,
  });
}
function clearConversations(state, action) {
  Object.assign(state, {
    conversations: [],
    displayedConversations: [],
    unreadCount: 0,
    conversation: null,
    messages: null,
    loading: true,
    onlineUsers: [],
    arrivalMessage: null,
    error: {},
  });
}

// @@ MESSENGER REDUCERS
const messengerSlice = createSlice({
  name: "messenger",
  initialState: initialState,
  reducers: {
    getConversations,
    getDisplayedConversations,
    getUnreadCount,
    getConversation,
    updateConversations,
    updateConversationsUnread,
    sendMessage,
    receiveMessage,
    getNextBatchMsgs,
    setOnlineUsers,
    setArrivalMessage,
    clearArrivalMessage,
    messengerError,
    clearConversation,
    clearConversations,
  },
});

export const messengerActions = messengerSlice.actions;
export default messengerSlice.reducer;
