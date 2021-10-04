import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const Notifications = (props) => {
  const { notification, closeHandler } = props;

  return (
    <div className="header-popup">
      <div className="notification-popup-inner">
        <div className="nav-top notification-title">Notifications</div>
        {!notification || notification.loading ? (
          <div className="no-notifications p-1">Loading</div>
        ) : !!notification.notifications.payload &&
          notification.notifications.payload.length ? (
          notification.notifications.payload.map((notification) => (
            <div key={notification._id}>
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
                    <Moment format="MMMM DD, YYYY">{notification.date}</Moment>
                  </span>
                </div>
              </Link>
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
