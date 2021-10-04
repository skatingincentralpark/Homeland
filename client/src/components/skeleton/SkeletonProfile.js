import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonProfile = ({ theme }) => {
  const themeClass = theme || "light";

  return (
    <>
      <div className={`skeleton-wrapper skeleton-gray mt-5 ${themeClass}`}>
        <div className="skeleton-profile-top">
          <div className="skeleton bigavatar gray"></div>
          <SkeletonElement type="title gray" />
          <SkeletonElement type="text xshort gray" />
        </div>
        <Shimmer />
      </div>

      <div className="skeleton-bottom">
        <div className={`skeleton-wrapper m-0 skeleton-intro ${themeClass}`}>
          <div className="skeleton-postItem-inner">
            <div className="skel-post-content">
              <SkeletonElement type="title short mb-1" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
            </div>
          </div>
          <Shimmer />
        </div>
        <div
          className={`skeleton-wrapper m-0 skeleton-postItem profile ${themeClass}`}
        >
          <div className="skeleton-postItem-inner">
            <div className="skel-post-top">
              <SkeletonElement type="avatar" />
              <div className="skel-post-info">
                <SkeletonElement type="author" />
                <SkeletonElement type="timestamp" />
              </div>
            </div>
            <div className="skel-post-content">
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
              <SkeletonElement type="text" />
            </div>
          </div>
          <Shimmer />
        </div>
      </div>
    </>
  );
};

export default SkeletonProfile;
