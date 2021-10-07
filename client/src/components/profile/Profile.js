import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Image from "react-graceful-image";

import { useDispatch, useSelector } from "react-redux";
import { getProfileById, notFound } from "../../store/profile/profile-actions";
import {
  getFriendRequests,
  sendFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  acceptFriendRequest,
} from "../../store/friendRequest/friendRequest-actions";
import {
  getPostsByUser,
  getPostsByUserNext,
} from "../../store/post/post-actions";
import { postActions } from "../../store/post/post-slice";

import PostItem from "../post/PostItem";
import FriendsList from "./FriendsList";
import NewPostForm from "../post/NewPostForm";
import SkeletonProfile from "../skeleton/SkeletonProfile";

const Profile = ({ match }) => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);
  const friendRequest = useSelector((state) => state.friendRequest);

  useEffect(() => {
    dispatch(postActions.clearPost());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProfileById(match.params.id));
    dispatch(getPostsByUser(match.params.id));
    dispatch(getFriendRequests());
  }, [dispatch, match.params.id]);

  const getNextBatch = (e) => {
    e.preventDefault();

    const lastPostId = posts.reduce((prev, curr) => {
      return prev._id < curr._id ? prev._id : curr._id;
    });

    dispatch(
      getPostsByUserNext({ userId: match.params.id, postId: lastPostId })
    );
  };

  let interests = [];
  if (profile) {
    interests = [...profile.interests];

    let last = interests.pop();
    last = last[0].toUpperCase() + last.slice(1).toLowerCase();

    if (interests.length > 1) {
      interests =
        interests
          .map(
            (interest) =>
              interest[0].toUpperCase() + interest.slice(1).toLowerCase()
          )
          .join(", ") +
        " and " +
        last;
    } else {
      interests = [last];
    }
  }

  if (loading) return <SkeletonProfile />;

  if (
    auth.user &&
    !profile &&
    !loading &&
    auth.user.payload._id === match.params.id
  )
    return (
      <div className="post mb-1 mt-5 m-auto px-1 bg-gradient">
        <div className="post-inner">
          <h1 className="white">Welcome to Homeland!</h1>
          <p className="white">
            Lets get you started by filling in some information & adding a
            display picture.
          </p>
          <Link className="link-button mt-2" to="/create-profile">
            Create Profile
          </Link>
        </div>
      </div>
    );

  if (!profile && !loading) {
    dispatch(notFound());
  }
  if (!profile && !loading) return <Redirect to="/newsfeed" />;

  return (
    <main className="profile mt-5">
      {profile ? (
        <>
          <div className="profile-top">
            <div className="display-picture">
              {auth.isAuthenticated &&
              auth.loading === false &&
              auth.user.payload._id === profile.user._id ? (
                <Link to="/edit-user">
                  <Image src={profile.user.profilepicture} />
                </Link>
              ) : (
                <Image src={profile.user.profilepicture} />
              )}
            </div>
            <span className="item-header-title">
              <b>{profile.user.name}</b>
            </span>
            {profile.location && (
              <span className="item-header-location">{profile.location}</span>
            )}
            {auth.loading === false &&
              auth.user.payload._id !== profile.user._id &&
              !auth.user.payload.friends.find(
                (friend) => friend === match.params.id
              ) && (
                <>
                  {!!friendRequest.friendRequests.find(
                    (request) => request.receiver === match.params.id
                  ) ? (
                    <button
                      disabled={friendRequest.loading}
                      className="link-button addFriend"
                      onClick={() => {
                        const request = friendRequest.friendRequests.find(
                          (request) => request.receiver === match.params.id
                        );
                        dispatch(cancelFriendRequest(request._id));
                      }}
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <>
                      {!!friendRequest.friendRequests.find(
                        (request) => request.sender === match.params.id
                      ) ? (
                        <div className="profile-request-container">
                          <span>Respond to their friend request</span>
                          <div>
                            <button
                              onClick={() => {
                                const request =
                                  friendRequest.friendRequests.find(
                                    (request) =>
                                      request.sender === match.params.id
                                  );
                                dispatch(acceptFriendRequest(request._id));
                              }}
                              className="link-button acceptDecline bg-white"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                const request =
                                  friendRequest.friendRequests.find(
                                    (request) =>
                                      request.sender === match.params.id
                                  );
                                dispatch(declineFriendRequest(request._id));
                              }}
                              className="link-button acceptDecline bg-white"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          disabled={friendRequest.loading}
                          className="link-button addFriend"
                          onClick={() => {
                            dispatch(sendFriendRequest(match.params.id));
                          }}
                        >
                          Add Friend
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
          </div>

          <div className="profile-bottom">
            <div className="profile-left">
              <div className="profile-item-container mt-0">
                <div className="profile-item-container-inner">
                  <div className="profile-item-header">
                    <span className="item-header-title">
                      <span>Intro</span>
                    </span>
                  </div>
                  <div className="profile-intro">
                    <ul className="m-0">
                      {profile.bio && (
                        <li className="profile-intro-bio">{profile.bio}</li>
                      )}
                      {profile.location && (
                        <li>
                          Lives in <b>{profile.location}</b>
                        </li>
                      )}
                      {profile.college && (
                        <li>
                          Went to <b>{profile.college}</b>
                        </li>
                      )}
                      {profile.job && (
                        <li>
                          Works at <b>{profile.job}</b>
                        </li>
                      )}
                      {profile.highschool && (
                        <li>
                          Highschool at <b>{profile.highschool}</b>
                        </li>
                      )}
                      {profile.interests && (
                        <li>
                          Interests include <b>{interests}</b>
                        </li>
                      )}
                      {profile.relationshipstatus && (
                        <li>
                          <b>{profile.relationshipstatus}</b>
                        </li>
                      )}
                    </ul>
                  </div>
                  {auth.isAuthenticated &&
                    auth.loading === false &&
                    auth.user.payload._id === profile.user._id && (
                      <Link to="/edit-profile" className="link-button">
                        Edit Profile
                      </Link>
                    )}
                </div>
              </div>
              <FriendsList id={match.params.id} profile={profile} />
            </div>
            <div className="profile-right">
              <NewPostForm profilepicture={profile.user.profilepicture} />
              {posts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
              <button onClick={getNextBatch}>Load more</button>
              {posts.length === 0 && (
                <div className="post">
                  <div className="post-header"> Your posts will go here</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="post mb-1 m-auto px-1 bg-gradient">
          <div className="post-inner">
            <h1 className="white">Welcome to Homeland!</h1>
            <p className="white">
              Lets get you started by filling in some information & adding a
              display picture.
            </p>
            <Link className="link-button mt-2" to="/create-profile">
              Create Profile
            </Link>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
