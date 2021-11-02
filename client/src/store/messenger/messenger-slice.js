import { createSlice } from "@reduxjs/toolkit";

// @@@@ MESSENGER SLICE

// @@ INITIAL STATE
const initialState = {
  conversations: [],
  displayedConversations: [],
  unreadCount: 0,
  conversation: null,
  messages: null,
  hasMore: true,
  showWindow: false,
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
function messengerLoading(state, action) {
  Object.assign(state, {
    loading: true,
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
function showWindow(state, action) {
  Object.assign(state, {
    showWindow: true,
  });
}
function hideWindow(state, action) {
  Object.assign(state, {
    showWindow: false,
  });
}
function sendMessage(state, action) {
  // to-do:   can refactor to index of
  // to-do:   have to add latest message to conversation then update state /w it

  const filteredConvs = state.conversations.filter(
    (conv) => conv._id !== action.payload.conversation._id
  );

  Object.assign(state, {
    messages: [action.payload.savedMessage, ...state.messages],
    conversation: action.payload.conversation,
    conversations: [action.payload.conversation, ...filteredConvs],
    loading: false,
  });
}
function getNextBatchMsgs(state, action) {
  if (action.payload.length === 0) {
    Object.assign(state, {
      hasMore: false,
      loading: false,
    });
  } else {
    Object.assign(state, {
      messages: [...state.messages, ...action.payload],
      loading: false,
    });
  }
}
function receiveMessage(state, action) {
  const updatedConvItem = state.conversations.find(
    (conv) => conv._id == action.payload.conversationId
  );

  Object.assign(state, {
    messages: [action.payload, ...state.messages],
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
    hasMore: true,
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
    showWindow: false,
    hasMore: true,
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
    messengerLoading,
    showWindow,
    hideWindow,
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
