import React from "react";
import { Link } from "react-router-dom";
import Image from "react-graceful-image";

const FriendItem = ({ friend }) => {
  return (
    <div className="profile-friends-item" key={friend._id}>
      <Link to={`/profile/${friend.user}`}>
        <Image src={friend.profilepicture} />
        <div className="name-container">{friend.name}</div>
      </Link>
    </div>
  );
};

export default FriendItem;
