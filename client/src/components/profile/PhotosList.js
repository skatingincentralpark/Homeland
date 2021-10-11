import React from "react";
import { Link } from "react-router-dom";
import Image from "react-graceful-image";

const PhotosList = (props) => {
  const { photoPosts, id } = props;

  return (
    <div className="profile-item-container">
      <div className="profile-item-container-inner">
        <div className="profile-item-header">
          <span className="item-header-title">Photos</span>
          <Link to={`/profile/${id}/photos`} className="item-header-seeall">
            See All Photos
          </Link>
        </div>
        {/* Profile Friends */}
        <div className="profile-item-grid profile-photos">
          {photoPosts.map((post) => (
            <div className="image-square-container" key={post._id}>
              <Link to={`/newsfeed/${post._id}`}>
                <Image src={post.image} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotosList;
