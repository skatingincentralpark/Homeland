import React from "react";

import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import ProfileTop from "./ProfileTop";

const ProfileLayout = ({ children }) => {
  const { loading } = useSelector((state) => state.profile);
  const location = useLocation();

  console.log(location);

  return (
    <>
      {!loading && <ProfileTop />}
      {children}
    </>
  );
};

export default ProfileLayout;
