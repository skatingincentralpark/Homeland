import React from "react";
import Shimmer from "./Shimmer";

import SkeletonElement from "./SkeletonElement";
import "./Skeleton.css";

const SkeletonText = (props) => {
  const { height, width, color, wrapperClasses } = props;

  const heightClass = "h-" + height;
  const widthClass = "w-" + width;

  return (
    <div className={`skeleton-wrapper skeleton-postItem m-0 ${wrapperClasses}`}>
      <div className="skel-post-info">
        <SkeletonElement
          type={`popupName ${heightClass} ${widthClass} ${color}`}
        />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonText;
