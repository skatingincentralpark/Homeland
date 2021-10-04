import axios from "axios";

import { notificationActions } from "./notification-slice";

// @@   Get notifications for current user
export const getNotifications = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/notification");

    dispatch(
      notificationActions.getNotifications({
        payload: res.data,
      })
    );
  } catch (error) {
    dispatch(notificationActions.notificationError());
  }
};

// @@   Read notifications for current user
export const readNotifications = () => async (dispatch) => {
  try {
    const res = await axios.put("/api/notification");

    dispatch(
      notificationActions.readNotifications({
        payload: res.data,
      })
    );
  } catch (error) {
    dispatch(notificationActions.notificationError());
  }
};
