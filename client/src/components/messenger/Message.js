import React from "react";
import Moment from "react-moment";

import "./messenger.css";

const Message = ({ message, own, profilepicture }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <div className="post-avatar">
          <img src={profilepicture} alt="user avatar" />
        </div>
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        <Moment fromNow>{message.createdAt}</Moment>
      </div>
    </div>
  );
};

export default Message;
