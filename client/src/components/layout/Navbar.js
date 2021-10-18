import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/clickOutside";

import Logo from "../../static/svg/logo.svg";
import Notification from "../../static/svg/notification.svg";
import Dropdown from "../../static/svg/dropdown.svg";

import { useDispatch, useSelector } from "react-redux";
import { readNotifications } from "../../store/notification/notification-actions";
import { logout } from "../../store/auth/auth-actions";
import Notifications from "./Notifications";

const Navbar = () => {
  const [toggleNav, setToggleNav] = useState(false);
  const [toggleNotif, setToggleNotif] = useState(false);

  const toggleNavHandler = () => {
    setToggleNav((prev) => !prev);
    setToggleNotif(false);
  };
  const toggleNotifHandler = () => {
    setToggleNotif((prev) => !prev);
    setToggleNav(false);
  };
  const closeHandler = () => {
    setToggleNav(false);
    setToggleNotif(false);
  };

  const headerRef = useRef();
  useClickOutside(headerRef, closeHandler);

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toggleNotif) {
      dispatch(readNotifications());
    }
  }, [toggleNotif, dispatch]);

  const logoutHandler = () => {
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
                    to={`/profile/${user.payload._id}`}
                    onClick={closeHandler}
                    className="header-right-container"
                  >
                    <div className="post-avatar">
                      <img
                        src={user.payload.profilepicture}
                        alt="user avatar"
                      />
                    </div>
                    <span>{user.payload.name.split(" ")[0]}</span>
                  </Link>
                )}
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
                              (n) => !n.readby.includes(user.payload._id)
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
                  <div className="nav-top">
                    <div className="post-avatar">
                      <img
                        src={user.payload.profilepicture}
                        alt="user avatar"
                      />
                    </div>
                    <div>
                      <Link
                        onClick={closeHandler}
                        className="nav-name"
                        to={`/profile/${user.payload._id}`}
                      >
                        {user.payload.name}
                      </Link>
                      <Link
                        onClick={closeHandler}
                        to={`/profile/${user.payload._id}`}
                      >
                        Visit your profile
                      </Link>
                    </div>
                  </div>
                  <div className="nav-mid">
                    <Link onClick={closeHandler} to="/newsfeed">
                      Newsfeed
                    </Link>
                    <Link
                      onClick={closeHandler}
                      to={`/profile/${user.payload._id}/friends`}
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
                  <div className="nav-bot">
                    <a onClick={logoutHandler} href="#!">
                      Logout
                    </a>
                  </div>
                </div>
              </nav>
            )}
            {toggleNotif && (
              <Notifications
                notification={notification}
                closeHandler={closeHandler}
              />
            )}
          </header>
        </>
      ) : (
        <></>
        // <header>
        //   <div className="header-inner">
        //     <div />
        //     <div className="header-logo">
        //       <Link to="/">
        //         <img src={Logo} alt="logo" className="svg" />
        //       </Link>
        //     </div>
        //   </div>
        // </header>
      )}
    </>
  );
};

export default Navbar;
