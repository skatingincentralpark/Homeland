import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonImage = ({ theme, refProp }) => {
  const themeClass = theme || "light";

  return (
    <div ref={refProp} className={`skeleton-wrapper ${themeClass}`}>
      <div className="skel-post-content">
        <SkeletonElement type="image" />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonImage;
