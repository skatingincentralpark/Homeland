import axios from "axios";

import { friendRequestActions } from "./friendRequest-slice";
import { notificationActions } from "../notification/notification-slice";
import { loadUser } from "../auth/auth-actions";

export const getFriendRequests = () => async (dispatch) => {
  //    Have to get friend request for curent user
  //    Update friend request slice (populate friend requests)
  dispatch(friendRequestActions.friendRequestLoading());
  try {
    const res = await axios.get(`/api/friend-request`);

    dispatch(friendRequestActions.getFriendRequests(res.data));
  } catch (err) {
    dispatch(
      friendRequestActions.friendRequestError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
export const sendFriendRequest = (userId) => async (dispatch) => {
  //    Make friend request api call
  //    Update friend request slice (push new one)
  try {
    const res = await axios.post(`/api/friend-request/${userId}`);

    dispatch(friendRequestActions.addFriendRequest(res.data));
  } catch (err) {
    dispatch(
      friendRequestActions.friendRequestError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
export const cancelFriendRequest = (requestId) => async (dispatch) => {
  //    Make friend request api call (to cancel)
  //    Update friend request slice (delete request)
  try {
    await axios.delete(`/api/friend-request/cancel/${requestId}`);

    dispatch(friendRequestActions.removeFriendRequest(requestId));
  } catch (err) {
    dispatch(
      friendRequestActions.friendRequestError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
export const acceptFriendRequest = (requestId) => async (dispatch) => {
  //    Make friend request api call (to accept)
  //    Update friend request slice (delete request)
  try {
    await axios.put(`/api/friend-request/${requestId}`);

    dispatch(friendRequestActions.acceptFriendRequest(requestId));
    dispatch(notificationActions.removeNotification(requestId));
    dispatch(loadUser());
  } catch (err) {
    dispatch(
      friendRequestActions.friendRequestError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
export const declineFriendRequest = (requestId) => async (dispatch) => {
  //    Make friend request api call (to decline)
  //    Update friend request slice (delete request)
  try {
    await axios.delete(`/api/friend-request/decline/${requestId}`);

    dispatch(friendRequestActions.declineFriendRequest(requestId));
    dispatch(notificationActions.removeNotification(requestId));
  } catch (err) {
    dispatch(
      friendRequestActions.friendRequestError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};
