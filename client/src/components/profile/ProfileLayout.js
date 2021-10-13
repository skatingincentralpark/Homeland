import React from "react";

import ProfileTop from "./ProfileTop";
import { useSelector } from "react-redux";

const ProfileLayout = (props) => {
  const { match } = props;

  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const friendRequest = useSelector((state) => state.friendRequest);

  return (
    <>
      {!loading && (
        <ProfileTop
          auth={auth}
          profile={profile}
          match={match}
          friendRequest={friendRequest}
        />
      )}
      {props.children}
    </>
  );
};

export default ProfileLayout;
