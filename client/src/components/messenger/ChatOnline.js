import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import "./messenger.css";

const ChatOnline = ({ onlineUsers, currentId, getConversation, friends }) => {
  const dispatch = useDispatch();
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const onlineIds = onlineUsers.map((o) => o.userId);
    setOnlineFriends(friends.filter((f) => onlineIds.includes(f.user)));
  }, [friends, onlineUsers]);

  return (
    <div className="chatOnline">
      {onlineFriends.map((friend) => (
        <div className="chatOnlineFriend" key={friend._id}>
          <div className="chatOnlineImgContainer">
            <div className="post-avatar med-avatar">
              <img src={friend.profilepicture} alt="user avatar" />
            </div>
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{friend.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
