import { useState, useEffect } from "react";

export const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };

    // Bind
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};
