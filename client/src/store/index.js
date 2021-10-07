import { configureStore } from "@reduxjs/toolkit";

// Reducer(s)
import alertReducer from "./alert/alert-slice";
import authReducer from "./auth/auth-slice";
import profileReducer from "./profile/profile-slice";
import postReducer from "./post/post-slice";
import notificationReducer from "./notification/notification-slice";
import friendRequestReducer from "./friendRequest/friendRequest-slice";

const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    profile: profileReducer,
    post: postReducer,
    notification: notificationReducer,
    friendRequest: friendRequestReducer,
  },
});

export default store;
