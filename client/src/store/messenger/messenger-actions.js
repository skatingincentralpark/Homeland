import axios from "axios";

import { messengerActions } from "./messenger-slice";

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
  try {
    const res = await axios.get(`/api/messages/${conversationId}`);

    dispatch(
      messengerActions.getConversation({ conversationId, messages: res.data })
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

export const sendMessage = (message) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/messages`, message);

    dispatch(messengerActions.sendMessage(res.data));
  } catch (err) {
    dispatch(
      messengerActions.messengerError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
