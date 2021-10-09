import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonImage2 = ({ theme, refProp }) => {
  const themeClass = theme || "light";

  return (
    <div ref={refProp} className={`skeleton-wrapper ${themeClass}`}>
      <SkeletonElement type="image2" />
      <Shimmer />
    </div>
  );
};

export default SkeletonImage2;
