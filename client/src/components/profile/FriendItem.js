import React from "react";
import { Link } from "react-router-dom";

const FriendItem = () => {
  return (
    <div className="profile-friends-item">
      <div className="profile-friends-item-image"></div>
      <div className="name-container">
        <Link to="/profile/charlie">Charles Zhao</Link>
      </div>
    </div>
  );
};

export default FriendItem;
