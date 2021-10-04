import React from "react";

import FriendItem from "./FriendItem";

import { useSelector } from "react-redux";

const Friends = () => {
  const { loading } = useSelector((state) => state.auth);

  if (loading) return <h1 className="p-1 mt-2">Loading...</h1>;

  return (
    <main className="profile mt-5">
      <div className="profile-top">
        <div className="profile-avatar" />
        <span className="item-header-title">
          <b>Charles Zhao</b>
        </span>
        <span className="item-header-location">Sydney, Australia</span>
      </div>

      <div className="profile-item-container m-auto maxw-70">
        <div className="profile-item-container-inner">
          <div className="profile-item-header">
            <span className="item-header-title">Friends</span>
          </div>
          <div className="all-friends">
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Friends;
