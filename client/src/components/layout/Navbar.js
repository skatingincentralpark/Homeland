import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/clickOutside";
import { io } from "socket.io-client";

import Logo from "../../static/svg/logo.svg";
import Notification from "../../static/svg/notification.svg";
import Dropdown from "../../static/svg/dropdown.svg";
import Messenger from "../../static/svg/messenger.svg";

import { useDispatch, useSelector } from "react-redux";
import { readNotifications } from "../../store/notification/notification-actions";
import { logout } from "../../store/auth/auth-actions";

import MessengerPopup from "./MessengerPopup";
import NotificationsPopup from "./NotificationsPopup";

const Navbar = ({ socket }) => {
  const [toggleNav, setToggleNav] = useState(false);
  const [toggleNotif, setToggleNotif] = useState(false);
  const [toggleMessenger, setToggleMessenger] = useState(false);

  const toggleNavHandler = () => {
    setToggleNav((prev) => !prev);
    setToggleNotif(false);
    setToggleMessenger(false);
  };
  const toggleNotifHandler = () => {
    setToggleNotif((prev) => !prev);
    setToggleNav(false);
    setToggleMessenger(false);
  };
  const toggleMessengerHandler = () => {
    setToggleMessenger((prev) => !prev);
    setToggleNav(false);
    setToggleNotif(false);
  };
  const closeHandler = () => {
    setToggleNav(false);
    setToggleNotif(false);
    setToggleMessenger(false);
  };

  const headerRef = useRef();
  useClickOutside(headerRef, closeHandler);

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const notification = useSelector((state) => state.notification);
  const messenger = useSelector((state) => state.messenger);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toggleNotif) {
      dispatch(readNotifications());
    }
  }, [toggleNotif, dispatch]);

  const logoutHandler = () => {
    socket.current.emit("manualDisconnect");
    dispatch(logout());
    closeHandler();
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <header ref={headerRef}>
            <div className="header-inner">
              <div />
              <div className="header-logo">
                <Link to="/" onClick={closeHandler}>
                  <img src={Logo} alt="logo" className="svg" />
                </Link>
              </div>

              <div className="header-right">
                {!loading && user && (
                  <Link
                    to={`/profile/${user?.payload._id}`}
                    onClick={closeHandler}
                    className="header-right-container"
                  >
                    <div className="post-avatar">
                      <img
                        src={user?.payload.profilepicture}
                        alt="user avatar"
                      />
                    </div>
                    <span>{user?.payload.name.split(" ")[0]}</span>
                  </Link>
                )}
                <button className="bell" onClick={toggleMessengerHandler}>
                  <img src={Messenger} alt="messenger" className="svg" />
                  {!messenger || messenger.loading || !messenger.unreadCount ? (
                    ""
                  ) : (
                    <span>{messenger.unreadCount}</span>
                  )}
                </button>
                <button className="bell" onClick={toggleNotifHandler}>
                  <img src={Notification} alt="bell" className="svg" />

                  {!notification || notification.loading ? (
                    ""
                  ) : (
                    <>
                      {!notification.notifications.filter(
                        (n) => !n.readby.includes(user?.payload._id)
                      ).length ? (
                        ""
                      ) : (
                        <span>
                          {
                            notification.notifications.filter(
                              (n) => !n.readby.includes(user?.payload._id)
                            ).length
                          }
                        </span>
                      )}
                    </>
                  )}
                </button>
                <button onClick={toggleNavHandler}>
                  <img src={Dropdown} alt="navigation button" />
                </button>
              </div>
            </div>
            {toggleNav && (
              <nav className="header-popup">
                <div className="py-05">
                  <div className="nav-top py-05">
                    <div className="post-avatar">
                      <img
                        src={user?.payload.profilepicture}
                        alt="user avatar"
                      />
                    </div>
                    <div>
                      <Link
                        onClick={closeHandler}
                        className="nav-name"
                        to={`/profile/${user?.payload._id}`}
                      >
                        {user?.payload.name}
                      </Link>
                      <Link
                        onClick={closeHandler}
                        to={`/profile/${user?.payload._id}`}
                      >
                        Visit your profile
                      </Link>
                    </div>
                  </div>
                  <div className="nav-mid py-1">
                    <Link onClick={closeHandler} to="/newsfeed">
                      Newsfeed
                    </Link>
                    <Link
                      onClick={closeHandler}
                      to={`/profile/${user?.payload._id}/friends`}
                    >
                      Friends
                    </Link>

                    {profile ? (
                      <Link onClick={closeHandler} to="/edit-profile">
                        Profile Settings
                      </Link>
                    ) : (
                      <Link onClick={closeHandler} to="/create-profile">
                        Profile Settings
                      </Link>
                    )}

                    <Link onClick={closeHandler} to="/edit-user">
                      Account Settings
                    </Link>
                  </div>
                  <div className="nav-bot py-05">
                    <a onClick={logoutHandler} href="#!">
                      Logout
                    </a>
                  </div>
                </div>
              </nav>
            )}
            {toggleNotif && (
              <NotificationsPopup
                notification={notification}
                closeHandler={closeHandler}
              />
            )}
            {toggleMessenger && <MessengerPopup closeHandler={closeHandler} />}
          </header>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
