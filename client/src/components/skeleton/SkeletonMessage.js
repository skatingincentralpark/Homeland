import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonMessage = () => {
  return (
    <div className={`skeleton-wrapper skeleton-postItem m-0 mt-2`}>
      <div className="skel-post-top">
        <SkeletonElement type="avatar" />
        <div className="skel-post-info">
          <SkeletonElement type="message" />
        </div>
      </div>

      <Shimmer />
    </div>
  );
};

export default SkeletonMessage;
