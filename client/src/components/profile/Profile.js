import React, { useEffect, useCallback } from "react";
import { Link, Redirect } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { useDispatch, useSelector } from "react-redux";
import {
  getProfileById,
  notFound,
  getPhotos,
} from "../../store/profile/profile-actions";
import {
  getPostsByUser,
  getPostsByUserNext,
} from "../../store/post/post-actions";
import { postActions } from "../../store/post/post-slice";
import { getFriendRequests } from "../../store/friendRequest/friendRequest-actions";

import PhotosList from "./PhotosList";
import ProfileTop from "./ProfileTop";
import FriendsList from "./FriendsList";
import PostItem from "../post/PostItem";
import NewPostForm from "../post/NewPostForm";
import SkeletonProfile from "../skeleton/SkeletonProfile";

const Profile = (props) => {
  const { computedMatch: match, socket, socketReady } = props;

  const dispatch = useDispatch();
  const { profile, loading, photos } = useSelector((state) => state.profile);
  const { posts } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);
  const friendRequest = useSelector((state) => state.friendRequest);

  useEffect(() => {
    dispatch(postActions.clearPost());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProfileById(match.params.id));
    dispatch(getPostsByUser(match.params.id));
    dispatch(getPhotos(match.params.id));
    dispatch(getFriendRequests());
  }, [dispatch, match.params.id]);

  let currentId;
  if (!auth.loading) {
    currentId = auth.user.payload._id;
  }

  // Lazy load
  const getNextBatch = () => {
    if (posts.length === 1) {
      return;
    } else if (posts.length) {
      const lastPostId = posts.reduce((prev, curr) => {
        return prev._id < curr._id ? prev._id : curr._id;
      });

      dispatch(
        getPostsByUserNext({ userId: match.params.id, postId: lastPostId })
      );
    }
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

  // @@      ON GET NEW POST
  //         If user is on the post author's profile when received, then update posts
  const addPostHandler = useCallback(
    async (post) => {
      if (post.user === match.params.id && currentId !== match.params.id) {
        dispatch(postActions.addPost(post));
      }
    },
    [currentId, match.params.id, dispatch]
  );

  useEffect(() => {
    let socketCurrent = null;

    if (socketReady) {
      socket.current.on("getPosts", addPostHandler);
      socketCurrent = socket.current;
    }

    return () => {
      if (socketReady) socketCurrent.off("getPosts", addPostHandler);
    };
  }, [socket, socketReady, dispatch, match.params.id, addPostHandler]);

  // @@      ON REMOVE POST
  useEffect(() => {
    const removePostHandler = async (postId) => {
      dispatch(postActions.deletePost(postId));
    };

    let socketCurrent = null;

    if (socketReady) {
      socket.current.on("removePostUpdate", removePostHandler);
      socketCurrent = socket.current;
    }

    return () => {
      if (socketReady) socketCurrent.off("removePostUpdate", removePostHandler);
    };
  }, [socket, dispatch, socketReady]);

  if (loading)
    return (
      <main className="profile pt-5 mx-1">
        <SkeletonProfile />
      </main>
    );

  if (auth.user && !profile && !loading && currentId === match.params.id)
    return (
      <main className="profile pt-5">
        <div className="post mb-1 m-auto px-1 mt-2 bg-gradient maxw-40">
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
      </main>
    );

  if (!profile && !loading) {
    dispatch(notFound());
  }
  if (!profile && !loading) return <Redirect to="/newsfeed" />;

  return (
    <main className="profile">
      {profile ? (
        <>
          <ProfileTop
            auth={auth}
            profile={profile}
            match={match}
            friendRequest={friendRequest}
            socket={socket}
          />
          <div className="profile-bottom">
            <div className="profile-left">
              <div className="profile-item-container mt-0">
                <div className="profile-item-container-inner">
                  <div className="profile-item-header">
                    <span className="mb-05">
                      <span className="item-header-title">
                        <b>Intro</b>
                      </span>
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
                    currentId === profile.user._id && (
                      <>
                        <Link to="/edit-profile" className="link-button mb-05">
                          Edit Profile
                        </Link>
                        <Link to="/edit-user" className="link-button">
                          Edit Account
                        </Link>
                      </>
                    )}
                </div>
              </div>
              {!profile.loading && (
                <>
                  <FriendsList
                    loading={loading}
                    id={match.params.id}
                    profile={profile}
                    auth={auth}
                  />
                  <PhotosList photoPosts={photos} id={match.params.id} />
                </>
              )}
            </div>
            <div className="profile-right">
              <NewPostForm
                profilepicture={profile.user.profilepicture}
                socket={socket}
              />
              <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={getNextBatch}
                hasMore={true}
                loader={<></>}
                scrollThreshold="20px"
                endMessage={<p></p>}
              >
                {posts.map((post) => (
                  <PostItem key={post._id} post={post} socket={socket} />
                ))}
              </InfiniteScroll>
              {posts.length === 0 && (
                <div className="post">
                  <div className="post-header pb-1 gray">
                    Your posts will go here
                  </div>
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
