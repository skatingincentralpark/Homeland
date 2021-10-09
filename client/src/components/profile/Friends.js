import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Image from "react-graceful-image";

import { useDispatch, useSelector } from "react-redux";
import { getProfileById, notFound } from "../../store/profile/profile-actions";

import FriendItem from "./FriendItem";

const Friends = ({ match }) => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfileById(match.params.id));
  }, [dispatch, match.params.id]);

  if (loading) return <h1 className="p-1 mt-2">Loading...</h1>;

  if (!profile && !loading) {
    dispatch(notFound());
  }
  if (!profile && !loading) return <Redirect to="/newsfeed" />;

  return (
    <main className="profile pt-5">
      {!profile.loading && (
        <>
          <div className="profile-top">
            <div className="display-picture">
              <Link to="/edit-user">
                <Image src={profile.user.profilepicture} />
              </Link>
            </div>
            <span className="item-header-title mb-05">
              <b>{profile.user.name}</b>
            </span>
            <span className="item-header-location">{profile.location}</span>
          </div>

          <div className="profile-item-container m-auto maxw-70">
            <div className="profile-item-container-inner p-2">
              <div className="profile-item-header">
                <span className="item-header-title">Friends</span>
              </div>
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
