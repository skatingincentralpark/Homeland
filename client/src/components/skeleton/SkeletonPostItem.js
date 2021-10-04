import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonPostItem = ({ theme }) => {
  const themeClass = theme || "light";

  return (
    <div className={`skeleton-wrapper skeleton-postItem ${themeClass}`}>
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
  );
};

export default SkeletonPostItem;
