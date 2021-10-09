import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import { useDispatch, useSelector } from "react-redux";
import {
  declineFriendRequest,
  acceptFriendRequest,
} from "../../store/friendRequest/friendRequest-actions";

const Notifications = (props) => {
  const { notification, closeHandler } = props;

  const dispatch = useDispatch();

  return (
    <div className="header-popup">
      <div className="notification-popup-inner">
        <div className="nav-top notification-title">Notifications</div>
        {!notification || notification.loading ? (
          <div className="no-notifications p-1">Loading</div>
        ) : !!notification.notifications &&
          notification.notifications.length ? (
          notification.notifications.map((notification) => (
            <div key={notification._id}>
              {notification.status === "GENERAL" ||
              notification.status === "FRIEND" ? (
                <Link
                  to={`/profile/${notification.sender}`}
                  className="notification-item"
                  onClick={closeHandler}
                >
                  <div className="post-avatar">
                    <img src={notification.profilepicture} alt="" />
                  </div>
                  <div>
                    <span>{notification.body}</span>
                    <span className="notification-timestamp">
                      <Moment format="MMMM DD, YYYY">
                        {notification.date}
                      </Moment>
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  to={`/newsfeed/${notification.id}`}
                  className="notification-item"
                  onClick={closeHandler}
                >
                  <div className="post-avatar">
                    <img src={notification.profilepicture} alt="" />
                  </div>
                  <div>
                    <span>{notification.body}</span>
                    <span className="notification-timestamp">
                      <Moment format="MMMM DD, YYYY">
                        {notification.date}
                      </Moment>
                    </span>
                  </div>
                </Link>
              )}
              {notification.status === "FRIEND" && (
                <div className="notification-btn-container">
                  <button
                    onClick={() => {
                      dispatch(acceptFriendRequest(notification.id));
                    }}
                    className="link-button mx-05 w-100 bg-gray1"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      dispatch(declineFriendRequest(notification.id));
                    }}
                    className="link-button mx-05 w-100 bg-gray1"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-notifications p-1">No notifications found</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
