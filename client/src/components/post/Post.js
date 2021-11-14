import React, { useEffect, useCallback } from "react";

import PostItem from "./PostItem";

import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../store/post/post-actions";
import { postActions } from "../../store/post/post-slice";
import { updatePost } from "../../store/post/post-actions";
import { profileActions } from "../../store/profile/profile-slice";
import { getNotifications } from "../../store/notification/notification-actions";

import SkeletonPostItem from "../skeleton/SkeletonPostItem";

const Post = ({ computedMatch: match, socket, socketReady }) => {
  const dispatch = useDispatch();

  const { post, loading } = useSelector((state) => state.post);
  const auth = useSelector((state) => state.auth);

  let currentId;
  if (!auth.loading) {
    currentId = auth.user.payload._id;
  }

  useEffect(() => {
    dispatch(profileActions.clearProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPost(match.params.id));
  }, [dispatch, match.params.id]);

  // @@      ON GET NEW POST
  const addPostHandler = useCallback(
    async (post) => {
      if (currentId !== post.user) {
        dispatch(postActions.addPost(post));
      }
    },
    [currentId, dispatch]
  );

  useEffect(() => {
    let socketCurrent = null; // <-- variable to hold ref value

    if (socketReady) {
      socket.current.on("getPosts", addPostHandler);
      socketCurrent = socket.current; // <-- save ref value
    }

    return () => {
      if (socketReady) socketCurrent.off("getPosts", addPostHandler);
    };
  }, [socket, dispatch, socketReady, addPostHandler]);

  // @@      ON REMOVE POST
  useEffect(() => {
    const removePostHandler = async (postId) => {
      dispatch(postActions.deletePost(postId));
    };

    let socketCurrent = null; // <-- variable to hold ref value

    if (socketReady) {
      socket.current.on("removePostUpdate", removePostHandler);
      socketCurrent = socket.current; // <-- save ref value
    }

    return () => {
      if (socketReady) socketCurrent.off("removePostUpdate", removePostHandler);
    };
  }, [socket, dispatch, socketReady]);

  // @@      ON UPDATE POST
  useEffect(() => {
    const updatePostHandler = async (postId) => {
      dispatch(updatePost(postId));
      dispatch(getNotifications());
    };

    let socketCurrent = null; // <-- variable to hold ref value

    if (socketReady) {
      socketCurrent = socket.current; // <-- save ref value
      socket.current.on("updatePost", updatePostHandler);
    }

    return () => {
      if (socketReady) socketCurrent.off("updatePost", updatePostHandler);
    };
  }, [socket, dispatch, socketReady]);

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
