import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  getProfileById,
  notFound,
  getPhotos,
} from "../../store/profile/profile-actions";
import { getFriendRequests } from "../../store/friendRequest/friendRequest-actions";
import {
  getPostsByUser,
  getPostsByUserNext,
} from "../../store/post/post-actions";
import { postActions } from "../../store/post/post-slice";

import PostItem from "../post/PostItem";
import FriendsList from "./FriendsList";
import PhotosList from "./PhotosList";
import NewPostForm from "../post/NewPostForm";
import SkeletonProfile from "../skeleton/SkeletonProfile";
import ProfileTop from "./ProfileTop";

const Profile = (props) => {
  const { match } = props;

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
    dispatch(getFriendRequests());
    dispatch(getPhotos(match.params.id));
  }, [dispatch, match.params.id]);

  // Lazy load
  useEffect(() => {
    const getNextBatch = () => {
      if (posts.length) {
        const lastPostId = posts.reduce((prev, curr) => {
          return prev._id < curr._id ? prev._id : curr._id;
        });

        dispatch(
          getPostsByUserNext({ userId: match.params.id, postId: lastPostId })
        );
      }
    };

    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;

      if (bottom) {
        console.log("at the bottom");
        getNextBatch();
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, match.params.id, posts]);

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

  if (loading)
    return (
      <main className="profile pt-5">
        <SkeletonProfile />
      </main>
    );

  if (
    auth.user &&
    !profile &&
    !loading &&
    auth.user.payload._id === match.params.id
  )
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
                    auth.user.payload._id === profile.user._id && (
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
                  />
                  <PhotosList photoPosts={photos} id={match.params.id} />
                </>
              )}
            </div>
            <div className="profile-right">
              <NewPostForm profilepicture={profile.user.profilepicture} />
              {posts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))}
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
