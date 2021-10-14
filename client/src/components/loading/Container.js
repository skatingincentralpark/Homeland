import React from "react";

const Container = ({ animationDuration, children, isFinished }) => (
  <div
    style={{
      opacity: isFinished ? 0 : 1,
      pointerEvents: "none",
      transition: `opacity ${animationDuration}ms linear`,
      zIndex: 100,
    }}
  >
    {children}
  </div>
);

export default Container;
