import React, { useEffect } from "react";

import PostItem from "./PostItem";

import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../store/post/post-actions";
import { postActions } from "../../store/post/post-slice";
import { updatePost } from "../../store/post/post-actions";
import { profileActions } from "../../store/profile/profile-slice";
import { getNotifications } from "../../store/notification/notification-actions";

import SkeletonPostItem from "../skeleton/SkeletonPostItem";

const Post = ({ computedMatch: match, socket }) => {
  const dispatch = useDispatch();

  const { post, loading } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileActions.clearProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPost(match.params.id));
  }, [dispatch, match.params.id]);

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

  // @@      ON UPDATE POST
  useEffect(() => {
    const updatePostHandler = async (postId) => {
      dispatch(updatePost(postId));
      dispatch(getNotifications());
    };

    if (!!socket.current) {
      socket.current.on("updatePost", updatePostHandler);
    }

    return () => {
      socket.current.off("updatePost", updatePostHandler);
    };
  }, [socket.current]);

  return (
    <main className="single-post">
      {loading || post === null ? (
        <SkeletonPostItem />
      ) : (
        <PostItem post={post} socket={socket} />
      )}
    </main>
  );
};

export default Post;
