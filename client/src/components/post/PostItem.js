import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Image from "react-graceful-image";

import NewCommentForm from "./NewCommentForm";
import Comments from "./Comments";
import Ellipsis from "../../static/svg/ellipsis.svg";

import { useSelector, useDispatch } from "react-redux";
import { addLike, deletePost, removeLike } from "../../store/post/post-actions";

import SkeletonImage from "../skeleton/SkeletonImage";

const PostItem = (props) => {
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

  const [userLiked, setUserLiked] = useState(false);
  const [toggleComments, setToggleComments] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);

  const toggleCommentsHandler = () => {
    setToggleComments((prev) => !prev);
  };
  const togglePopupHandler = () => {
    setTogglePopup((prev) => !prev);
  };

  const addLikeHandler = () => {
    dispatch(addLike(_id));
    setUserLiked(true);
  };
  const removeLikeHandler = () => {
    dispatch(removeLike(_id));
    setUserLiked(false);
  };

  useEffect(() => {
    if (auth.user && likes.length > 0) {
      setUserLiked(!!likes.find((like) => like.user === auth.user.payload._id));
    }
  }, [auth]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsUsersPost(auth.user.payload._id === user);
    }
  }, [auth.user]);

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
                <img src={Ellipsis} alt="" />
              </button>
            )}
            {togglePopup && (
              <div
                onClick={(e) => dispatch(deletePost(_id))}
                className="post-popup"
              >
                <button className="button-to-link">Delete Post</button>
              </div>
            )}
          </>
        </div>
      </div>
      {/* Post Content */}
      <div className="post-content">
        {text && (
          <div className="post-content-text">
            {text.map((txt, i) =>
              txt.type === "br" ? (
                <br key={i} />
              ) : (
                <Fragment key={i}>{txt}</Fragment>
              )
            )}
          </div>
        )}
        {image && (
          <div className="post-content-image">
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
          <div className="post-content-interactions">
            {!userLiked ? (
              <button onClick={addLikeHandler} className="btn-like">
                Like
              </button>
            ) : (
              <button onClick={removeLikeHandler} className="btn-like">
                Unlike
              </button>
            )}
            <button onClick={toggleCommentsHandler}>Comment</button>
            <button className="btn-share">Share</button>
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
            />
            <div className="post-footer-comments">
              <Comments comments={comments} postId={_id} />
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default PostItem;
