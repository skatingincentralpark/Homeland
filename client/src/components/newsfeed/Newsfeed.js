import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getPosts, getPostsNext } from "../../store/post/post-actions";
import { profileActions } from "../../store/profile/profile-slice";
import { postActions } from "../../store/post/post-slice";
import { friendRequestActions } from "../../store/friendRequest/friendRequest-slice";

import PostItem from "../post/PostItem";
import NewPostForm from "../post/NewPostForm";
import SkeletonPostItem from "../skeleton/SkeletonPostItem";

const Newsfeed = () => {
  const [profileExists, setProfileExists] = useState(true);

  const { posts, loading } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);
  const ui = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
    dispatch(profileActions.clearProfile());
    dispatch(postActions.clearPost());
    dispatch(friendRequestActions.clearFriendRequests());
  }, [dispatch]);

  useEffect(() => {
    if (auth.user && !auth.loading && !ui.loading) {
      setProfileExists(auth.user.payload.profile);
    }
  }, [auth.user]);

  // @@     LAZY LOAD
  const getNextBatch = () => {
    if (posts.length) {
      const lastPostId = posts.reduce((prev, curr) => {
        return prev._id < curr._id ? prev._id : curr._id;
      });
      dispatch(getPostsNext(lastPostId));
    }
  };

  return (
    <main className="newsfeed">
      {/* New User Module */}
      {!profileExists && (
        <div className="post mb-2 px-1 bg-gradient">
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
      {/* Text Input */}
      {auth.user && (
        <NewPostForm profilepicture={auth.user.payload.profilepicture} />
      )}
      {/* Posts */}
      {loading ? (
        <>
          <SkeletonPostItem />
          <SkeletonPostItem />
          <SkeletonPostItem />
        </>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={getNextBatch}
          hasMore={true}
          loader={<SkeletonPostItem />}
          scrollThreshold="20px"
          endMessage={<p></p>}
        >
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      )}
    </main>
  );
};

export default Newsfeed;
