import React from "react";
import { Link } from "react-router-dom";
import Image from "react-graceful-image";

const FriendsList = () => {
  return (
    <div className="profile-item-container">
      <div className="profile-item-container-inner">
        <div className="profile-item-header">
          <Link to="/profile/charlie/friends" className="item-header-title">
            Friends
          </Link>
          <Link to="/profile/charlie/friends" className="item-header-seeall">
            See All Friends
          </Link>
        </div>
        {/* Profile Friends */}
        <div className="profile-friends">
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
          <div className="profile-friends-item">
            <Link to="/profile/charlie">
              <Image src="https://www.sigma-sein.com/en/wp/wp-content/uploads/2018/02/06111-1280x1280.jpg" />
              <div className="name-container">Charles Zhao</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
