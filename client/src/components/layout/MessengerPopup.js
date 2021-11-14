import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

import { useSelector, useDispatch } from "react-redux";
import { getConversation } from "../../store/messenger/messenger-actions";
import { messengerActions } from "../../store/messenger/messenger-slice";

import SkeletonConversation from "../skeleton/SkeletonConversation";

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
          {!messenger.loading ? (
            <>
              {messenger.displayedConversations.length ? (
                messenger.displayedConversations.map((conv) => (
                  <div
                    key={conv._id}
                    to={`/profile`}
                    className={`notification-item align-items-center relative ${
                      conv.unread === userId ? "bg-gray1" : ""
                    }`}
                    onClick={() => {
                      dispatch(messengerActions.showWindow());
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
                          {conv.latestMessage || "Just Added!"}
                        </span>
                        <div className="latestMessageFadeOut" />
                        <span className="message-popup-timestamp">
                          <Moment fromNow>{conv.updatedAt}</Moment>
                        </span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <span className="p-1 gray grayscale">
                    Currently empty &#128561;
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <SkeletonConversation />
              <SkeletonConversation />
            </>
          )}
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
