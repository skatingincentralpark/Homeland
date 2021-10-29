import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import { getConversation } from "../../store/messenger/messenger-actions";

const MessengerPopup = ({ closeHandler }) => {
  const dispatch = useDispatch();
  const messenger = useSelector((state) => state.messenger);
  const auth = useSelector((state) => state.auth);
  const userId = auth.user?.payload._id;

  return (
    <div className="header-popup">
      <div className="notification-popup-inner overflow-x-hidden">
        <div className="nav-top notification-title">Messages</div>
        <div className="nav-mid m-0">
          {messenger.displayedConversations.map((conv) => (
            <div
              key={conv._id}
              to={`/profile`}
              className={`notification-item align-items-center relative ${
                conv.unread == userId ? "bg-gray1" : ""
              }`}
              onClick={() => {
                dispatch(getConversation(conv.convId));
                closeHandler();
              }}
            >
              <div className="post-avatar">
                <img src={conv.profilepicture} alt="" />
              </div>
              <div>
                <span>{conv.name}</span>
                <span className="notification-timestamp">
                  <span className="message-preview">
                    {conv.latestMessage || "Send a Message ..."}
                  </span>
                  <div className="latestMessageFadeOut" />
                  <span className="message-popup-timestamp">
                    <Moment fromNow>{conv.updatedAt}</Moment>
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="nav-bot py-05 text-center med">
          <Link onClick={closeHandler} to="/messenger">
            See All in Messenger
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessengerPopup;