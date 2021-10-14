import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "react-graceful-image";

const FriendsList = ({ loading, profile, id }) => {
  const {
    user: { friends },
  } = profile;

  const [friendsArray, setFriendsArray] = useState([]);

  useEffect(() => {
    if (!loading && friends) {
      setFriendsArray(friends.slice(0, 9));
    }
  }, [friends]);

  return (
    <div className="profile-item-container">
      <div className="profile-item-container-inner">
        <div className="profile-item-header">
          <Link to={`/profile/${id}/friends`} className="item-header-title">
            Friends
          </Link>
          <Link to={`/profile/${id}/friends`} className="item-header-seeall">
            See All Friends
          </Link>
        </div>
        {/* Profile Friends */}
        {!loading && friends.length === 0 && (
          <span className="gray grayscale">Currently empty &#128539;</span>
        )}
        <div className="profile-item-grid">
          {friendsArray.map((friend) => (
            <div className="profile-friends-item" key={friend._id}>
              <Link to={`/profile/${friend.user}`}>
                <Image src={friend.profilepicture} />
                <div className="name-container">{friend.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
