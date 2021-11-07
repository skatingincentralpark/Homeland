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

const Newsfeed = ({ socket }) => {
  const [profileExists, setProfileExists] = useState(true);

  const { posts, loading } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);
  const ui = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // @@      ON GET NEW POST
  useEffect(() => {
    const addPostHandler = async (post) => {
      if (post.user !== auth.user.payload._id) {
        dispatch(postActions.addPost(post));
      }
    };

    if (!!socket.current) {
      socket.current.on("getPosts", addPostHandler);
    }

    return () => {
      socket.current.off("getPosts", addPostHandler);
    };
  }, [socket.current]);

  // @@      ON REMOVE POST
  useEffect(() => {
    const removePostHandler = async (postId) => {
      dispatch(postActions.deletePost(postId));
    };

    if (!!socket.current) {
      socket.current.on("removePostUpdate", removePostHandler);
    }

    return () => {
      socket.current.off("removePostUpdate", removePostHandler);
    };
  }, [socket.current]);

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
        <NewPostForm
          profilepicture={auth.user.payload.profilepicture}
          socket={socket}
        />
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
            <PostItem key={post._id} post={post} socket={socket} />
          ))}
        </InfiniteScroll>
      )}
    </main>
  );
};

export default Newsfeed;
