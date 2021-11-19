import axios from "axios";

import { messengerActions } from "./messenger-slice";
import { uiActions } from "../ui/ui-slice";

export const getConversations = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/conversations/${userId}`);

    dispatch(messengerActions.getConversations(res.data));
  } catch (err) {
    dispatch(
      messengerActions.messengerError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

export const getConversation = (conversationId) => async (dispatch) => {
  dispatch(uiActions.loadingTrue());
  dispatch(messengerActions.hasMoreMessages());
  try {
    const res = await axios.get(`/api/messages/${conversationId}`);

    const { messages, conversation } = res.data;

    if (!messages.length) {
      dispatch(messengerActions.hasNoMoreMessages());
    }

    dispatch(
      messengerActions.getConversation({
        conversationId,
        messages,
        conversation,
      })
    );
  } catch (err) {
    dispatch(
      messengerActions.messengerError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
  dispatch(uiActions.loadingFalse());
};

export const getNextBatchMsgs =
  ({ conversationId, msgId }) =>
  async (dispatch) => {
    try {
      const res = await axios.get(
        `/api/messages/next/${conversationId}/${msgId}`
      );

      dispatch(messengerActions.getNextBatchMsgs(res.data));
    } catch (err) {
      dispatch(
        messengerActions.messengerError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  };

export const sendMessage =
  ({ message, socket }) =>
  async (dispatch) => {
    try {
      const res = await axios.post(`/api/messages`, message);
      const { conversation, savedMessage } = res.data;

      socket.current.emit("sendMessage", savedMessage);

      dispatch(messengerActions.sendMessage({ conversation, savedMessage }));
    } catch (err) {
      dispatch(
        messengerActions.messengerError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  };

export const updateConversationsUnread =
  ({ text, receiverId, conversationId }) =>
  async (dispatch) => {
    // @@      Updates convs, removes the unread (for when user has conv open)
    try {
      await axios.put(`/api/messages/${conversationId}`);

      dispatch(
        messengerActions.updateConversationsUnread({
          text,
          receiverId,
          conversationId,
        })
      );
    } catch (err) {
      dispatch(
        messengerActions.messengerError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  };
