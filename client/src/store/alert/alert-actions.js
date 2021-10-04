import { v4 as uuidv4 } from "uuid";
import { alertActions } from "./alert-slice";

export const setAlert = (msg, alertType, timeout = 5000) => {
  return async (dispatch) => {
    const id = uuidv4();

    dispatch(
      alertActions.setAlert({
        msg,
        alertType,
        id,
      })
    );

    setTimeout(() => dispatch(alertActions.removeAlert(id)), timeout);
  };
};
