import React, { useEffect } from "react";

import PostItem from "./PostItem";

import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../store/post/post-actions";
import { profileActions } from "../../store/profile/profile-slice";

import SkeletonPostItem from "../skeleton/SkeletonPostItem";

const Post = ({ computedMatch: match, socket }) => {
  const dispatch = useDispatch();

  const { post, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(profileActions.clearProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPost(match.params.id));
  }, [dispatch, match.params.id]);

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
