import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonConversation1 = ({ theme }) => {
  const themeClass = theme || "light";

  return (
    <div className={`skeleton-wrapper skeleton-postItem ${themeClass} m-0`}>
      <div className="skeleton-postItem-inner">
        <div className="skel-post-top">
          <SkeletonElement type="avatar med" />
          <div className="skel-post-info">
            <SkeletonElement type="text short" />
            <div className="justify-space-between">
              <SkeletonElement type="text" />
            </div>
          </div>
        </div>
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonConversation1;
