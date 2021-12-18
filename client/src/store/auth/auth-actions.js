import axios from "axios";

import { setAlert } from "../alert/alert-actions";
import { authActions } from "./auth-slice";
import { profileActions } from "../profile/profile-slice";
import { notificationActions } from "../notification/notification-slice";
import { postActions } from "../post/post-slice";
import { friendRequestActions } from "../friendRequest/friendRequest-slice";
import { uiActions } from "../ui/ui-slice";
import { messengerActions } from "../messenger/messenger-slice";

import setAuthToken from "../../utils/setAuthToken";

// @@   Load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch(
      authActions.userLoaded({
        payload: res.data,
      })
    );
  } catch (error) {
    dispatch(authActions.authError());
  }
};

// @@   Edit user
export const edit = ({ name, email, password, image }) => {
  return async (dispatch) => {
    dispatch(uiActions.loadingTrue());
    try {
      let profilepicture;

      if (image) {
        const token = localStorage.token;
        setAuthToken();

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "profile-pictures");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkgzyvlpc/image/upload",
          formData
        );

        profilepicture = res.data.url;
        setAuthToken(token);
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      email = email.toLowerCase();
      const body = JSON.stringify({ name, email, password, profilepicture });

      const res = await axios.post("/api/users/edit", body, config);

      dispatch(authActions.updateSuccess(res.data));
      dispatch(loadUser());
      dispatch(setAlert("User Updated", "success"));
      dispatch(uiActions.loadingFalse());
    } catch (err) {
      dispatch(uiActions.loadingFalse());
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
  };
};

// @@   Register user
export const register = ({ name, email, password, image }) => {
  return async (dispatch) => {
    dispatch(uiActions.loadingTrue());
    try {
      let profilepicture;

      if (image) {
        setAuthToken();

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "profile-pictures");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkgzyvlpc/image/upload",
          formData
        );

        profilepicture = res.data.url;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      email = email.toLowerCase();
      const body = JSON.stringify({ name, email, password, profilepicture });

      const res = await axios.post("/api/users", body, config);

      dispatch(authActions.registerSuccess(res.data));

      dispatch(uiActions.loadingFalse());
      dispatch(loadUser());
    } catch (err) {
      dispatch(uiActions.loadingFalse());
      console.log(err.response.data);

      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch(authActions.registerFail());
    }
  };
};

// @@   Login user
export const login = (email, password) => {
  return async (dispatch) => {
    dispatch(uiActions.loadingTrue());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post("/api/auth", body, config);

      dispatch(authActions.loginSuccess(res.data));

      dispatch(uiActions.loadingFalse());
      dispatch(loadUser());
    } catch (err) {
      dispatch(uiActions.loadingFalse());
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch(authActions.loginFail());
    }
  };
};

// @@   Logout / clear profile
export const logout = () => {
  return async (dispatch) => {
    dispatch(authActions.logout());
    dispatch(profileActions.clearProfile());
    dispatch(notificationActions.clearNotifications());
    dispatch(postActions.clearPosts());
    dispatch(friendRequestActions.clearFriendRequests());
    dispatch(messengerActions.clearConversations());
  };
};
