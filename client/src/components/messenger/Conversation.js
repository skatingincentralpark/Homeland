import React from "react";
import Moment from "react-moment";

const Conversation = ({ conversation, onlineUserArr }) => {
  return (
    <div className="notification-item align-items-center relative p-05 overflow-x-hidden">
      <div className="header-right-container">
        <div className="chatOnlineImgContainer">
          <div className="post-avatar med-avatar">
            <img src={conversation?.profilepicture} alt="user avatar" />
          </div>
          {onlineUserArr?.includes(conversation?._id) && (
            <div className="chatOnlineBadge"></div>
          )}
        </div>
      </div>

      <div className="messenger-mob-display-none">
        <span>{conversation?.name}</span>
        <span className="notification-timestamp">
          <span className="message-preview">
            {conversation.latestMessage || "Just Added!"}
          </span>
          <div className="latestMessageFadeOut" />
          <span className="message-popup-timestamp">
            <Moment fromNow ago>
              {conversation.updatedAt}
            </Moment>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Conversation;
