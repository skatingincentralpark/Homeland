import React from "react";

const Friend = ({ friend }) => {
  return (
    <div className="conversation mt-2">
      <div className="header-right-container">
        <div className="post-avatar med-avatar">
          <img src={friend?.profilepicture} alt="user avatar" />
        </div>
        <span>{friend?.name}</span>
      </div>
    </div>
  );
};

export default Friend;
