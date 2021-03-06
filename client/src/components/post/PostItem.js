import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Linkify from "react-linkify";
import Image from "react-graceful-image";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

import NewCommentForm from "./NewCommentForm";
import Comments from "./Comments";
import Ellipsis from "../../static/svg/ellipsis.svg";

import { useSelector, useDispatch } from "react-redux";
import {
  addLike,
  deletePost,
  removeLike,
  updatePost,
} from "../../store/post/post-actions";

import SkeletonImage from "../skeleton/SkeletonImage";

const PostItem = (props) => {
  const customFetcher = async (url) => {
    const response = await fetch(
      `https://rlp-proxy.herokuapp.com/v2?url=${url}`
    );
    const json = await response.json();
    return json.metadata;
  };

  const [isUsersPost, setIsUsersPost] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const {
    _id,
    text,
    image,
    name,
    profilepicture,
    user,
    likes,
    comments,
    date,
  } = props.post;

  const { socket } = props;

  const [userLiked, setUserLiked] = useState(false);
  const [toggleComments, setToggleComments] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [link, setLink] = useState("");

  const toggleCommentsHandler = () => {
    setToggleComments((prev) => !prev);
  };
  const togglePopupHandler = () => {
    setTogglePopup((prev) => !prev);
  };

  useEffect(() => {
    if (toggleComments) {
      dispatch(updatePost(_id));
    }
  }, [toggleComments, dispatch, _id]);

  const addLikeHandler = () => {
    dispatch(addLike(_id, socket));
    setUserLiked(true);
  };
  const removeLikeHandler = () => {
    dispatch(removeLike(_id, socket));
    setUserLiked(false);
  };

  useEffect(() => {
    if (auth.user && likes.length > 0) {
      setUserLiked(!!likes.find((like) => like.user === auth.user.payload._id));
    }
  }, [auth, likes]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsUsersPost(auth.user.payload._id === user);
    }
  }, [auth.user, auth.isAuthenticated, user]);

  // @@     URLS

  const detectURLs = useCallback((message) => {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    if (message.match(urlRegex)) {
      setLink(message);
    }
  }, []);

  useEffect(() => {
    text.forEach((txt) => {
      if (txt.type !== "br") {
        detectURLs(txt);
      }
    });
  }, [text, detectURLs]);

  const deletePostHandler = () => {
    dispatch(deletePost(_id));
    socket.current.emit("removePost", _id);
  };

  const postContentInteractionsClasses = toggleComments
    ? "post-content-interactions showComments"
    : "post-content-interactions";

  return (
    <div className="post">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-header-left">
          <div className="post-avatar">
            <Link to={`/profile/${user}`}>
              <Image src={profilepicture} />
            </Link>
          </div>

          <div className="post-information">
            <span className="post-author">
              <Link to={`/profile/${user}`}>{name}</Link>
            </span>
            <span className="post-date">
              <Moment fromNow>{date}</Moment>
            </span>
          </div>
        </div>
        <div className="post-header-right">
          <>
            {isUsersPost && (
              <button
                className="extra-options-btn"
                onClick={togglePopupHandler}
              >
                <img src={Ellipsis} alt="extra options" />
              </button>
            )}
            {togglePopup && (
              <div onClick={deletePostHandler} className="post-popup">
                <button className="button-to-link">Delete Post</button>
              </div>
            )}
          </>
        </div>
      </div>
      {/* Post Content */}
      <div className="post-content">
        <div className="px-1 pt-1 line-break-anywhere">
          {text.map((txt, i) =>
            txt.type === "br" ? (
              <br key={i} />
            ) : (
              <Linkify key={i}>{txt}</Linkify>
            )
          )}
        </div>
        {link && (
          <LinkPreview
            className="m-1 mb-0 w-auto"
            url={link}
            width="100%"
            fetcher={customFetcher}
          />
        )}
        {image && (
          <div className="post-content-image pt-1">
            <Image
              src={image}
              customPlaceholder={(ref) => <SkeletonImage refProp={ref} />}
            />
          </div>
        )}
        <div className="post-content-interactions-container">
          {likes.length === 0 ? (
            ""
          ) : (
            <button className="post-content-likes">
              &#128077; {likes.length} {likes.length === 1 ? "Like" : "Likes"}
            </button>
          )}
          <div className={postContentInteractionsClasses}>
            {!userLiked ? (
              <button
                onClick={addLikeHandler}
                className="link-button inline bg-white"
              >
                Like
              </button>
            ) : (
              <button
                onClick={removeLikeHandler}
                className="link-button inline bg-white"
              >
                Unlike
              </button>
            )}
            <button
              className="link-button inline bg-white"
              onClick={toggleCommentsHandler}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
      {/* Post Footer */}
      {toggleComments && (
        <div className="post-footer">
          <>
            <NewCommentForm
              postId={_id}
              profilepicture={auth.user.payload.profilepicture}
              socket={socket}
            />
            <Comments comments={comments} postId={_id} socket={socket} />
          </>
        </div>
      )}
    </div>
  );
};

export default PostItem;
