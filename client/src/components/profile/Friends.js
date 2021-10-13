import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Image from "react-graceful-image";

import { useDispatch, useSelector } from "react-redux";
import { getProfileById, notFound } from "../../store/profile/profile-actions";
import { getFriendRequests } from "../../store/friendRequest/friendRequest-actions";

import FriendItem from "./FriendItem";
import ProfileTop from "./ProfileTop";

const Friends = ({ match }) => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const friendRequest = useSelector((state) => state.friendRequest);

  useEffect(() => {
    dispatch(getProfileById(match.params.id));
  }, [dispatch, match.params.id]);

  if (loading) return <h1 className="p-1 mt-2"></h1>;
  if (!profile && !loading) {
    dispatch(notFound());
    dispatch(getFriendRequests());
  }
  if (!profile && !loading) return <Redirect to="/newsfeed" />;

  return (
    <main className="profile">
      {!profile.loading && (
        <>
          <ProfileTop
            auth={auth}
            profile={profile}
            match={match}
            friendRequest={friendRequest}
          />
          <div className="profile-item-container m-auto maxw-70">
            <div className="profile-item-container-inner p-2">
              <div className="profile-item-header pb-1-5">
                <span className="item-header-title">Friends</span>
              </div>
              {!loading && !profile.user.friends.length && (
                <span className="gray grayscale mt-05 block">
                  Currently empty &#128539;
                </span>
              )}
              <div className="profile-friends grid-6">
                {profile.user.friends.map((friend) => (
                  <FriendItem key={friend._id} friend={friend} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Friends;
