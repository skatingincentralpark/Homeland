import React from "react";

import { useSelector } from "react-redux";

import ProfileTop from "./ProfileTop";

const ProfileLayout = ({ children }) => {
  const { loading } = useSelector((state) => state.profile);

  return (
    <>
      {!loading && <ProfileTop />}
      {children}
    </>
  );
};

export default ProfileLayout;
