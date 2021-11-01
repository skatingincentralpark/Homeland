import axios from "axios";

import { profileActions } from "./profile-slice";
import { authActions } from "../auth/auth-slice";
import { uiActions } from "../ui/ui-slice";

import { setAlert } from "../alert/alert-actions";

// @@   Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  dispatch(profileActions.profileLoading());
  try {
    // TEMP: axios will get id from x-auth-token
    const res = await axios.get("/api/profile/me");
    dispatch(
      // TEMP: dispatching to reducer to update state
      // TEMP: sending the axios response to Redux to store in state
      // TEMP: the response will be the whole profile
      profileActions.getProfile(res.data)
    );
  } catch (err) {
    dispatch(
      profileActions.profileError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  dispatch(profileActions.profileLoading(userId));
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch(profileActions.getProfile(res.data));
  } catch (err) {
    dispatch(
      profileActions.profileError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Get profile by ID
export const getProfileByIdNoLoading = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch(profileActions.getProfile(res.data));
  } catch (err) {
    dispatch(
      profileActions.profileError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Get photos
export const getPhotos = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/photos/${userId}`);

    dispatch(profileActions.getPhotos(res.data));
  } catch (err) {
    dispatch(
      profileActions.profileError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Create or update profile
export const createProfile =
  (formData, history, edit = false, userId) =>
  async (dispatch) => {
    dispatch(uiActions.loadingTrue());
    try {
      // Create config object, send POST request, which creates/edits a profile
      // Sends all the fields to mongo (company, website, location, etc.)
      // Dispatch GET_PROFILE which updates the profile reducer to populate UI etc.
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/profile", formData, config);

      dispatch(profileActions.getProfile(res.data));

      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      if (!edit) {
        history.push(`/profile/${userId}`);
      }
      dispatch(uiActions.loadingFalse());
    } catch (err) {
      dispatch(uiActions.loadingFalse());
      // If error, dispatch an alert for every error in the array
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch(
        profileActions.profileError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  };

// @@   Profile not found
export const notFound = () => async (dispatch) => {
  dispatch(setAlert("No profile found.", "danger"));
};

// @@   Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure?  This can NOT be undone")) {
    try {
      await axios.delete("/api/profile");

      dispatch(profileActions.clearProfile());
      dispatch(authActions.accountDeleted());

      dispatch(setAlert("Your account has been permanently deleted"));
    } catch (err) {
      dispatch(
        profileActions.profileError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  }
};
