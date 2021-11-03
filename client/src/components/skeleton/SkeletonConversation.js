import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonConversation = ({ theme }) => {
  const themeClass = theme || "light";

  return (
    <div className={`skeleton-wrapper skeleton-postItem ${themeClass} m-0`}>
      <div className="skeleton-postItem-inner">
        <div className="skel-post-top">
          <SkeletonElement type="avatar" />
          <div className="skel-post-info">
            <SkeletonElement type="text short" />
            <div className="justify-space-between">
              <SkeletonElement type="text med" />
              <SkeletonElement type="timestamp" />
            </div>
          </div>
        </div>
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonConversation;
