import React, { Fragment, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { useClickOutside } from "../../hooks/clickOutside";

import Ellipsis from "../../static/svg/ellipsis.svg";

import { useSelector, useDispatch } from "react-redux";
import { deleteComment } from "../../store/post/post-actions";

const CommentItem = (props) => {
  const { socket } = props;
  const { _id, user, name, date, text, profilepicture } = props.comment;

  const [togglePopup, setTogglePopup] = useState(false);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const togglePopupHandler = () => {
    if (togglePopup) {
      setTogglePopup(false);
    } else {
      setTogglePopup(true);
    }
  };

  // On click outside of popup menu
  const buttonRef = useRef();
  const closeHandler = () => {
    setTogglePopup(false);
  };
  useClickOutside(buttonRef, closeHandler);

  // Get width to adjust like bubble position
  const [likesClass, setLikesClass] = useState("likes-bubble");
  const bubble = useRef();
  useEffect(() => {
    const width = bubble.current.offsetWidth;
    if (width < 140) {
      setLikesClass("likes-bubble likes-adjust");
    }
  }, []);

  const deleteCommentHandler = () => {
    dispatch(deleteComment(props.postId, _id, socket));
  };

  return (
    <div className="comment">
      <div className="post-avatar">
        <Link to={`/profile/${user}`}>
          <img src={profilepicture ? profilepicture : null} alt="" />
        </Link>
      </div>
      <div className="comment-content">
        <div className="comment-top">
          <div className="comment-content-bubble" ref={bubble}>
            <div className="bubble-inner">
              <div className="comment-author">
                <Link to={`/profile/${user}`}>{name}</Link>
              </div>
              {text.map((txt, i) =>
                txt.type === "br" ? (
                  <br key={i} />
                ) : (
                  <Fragment key={i}>{txt}</Fragment>
                )
              )}
            </div>
            {/* <div className={likesClass}>15 &#128077;</div> */}
          </div>
          <div className="relative">
            {user === auth.user.payload._id && (
              <>
                <button
                  onClick={togglePopupHandler}
                  className="extra-options-btn"
                >
                  <img src={Ellipsis} alt="" />
                </button>
                {togglePopup && (
                  <div className="post-popup" ref={buttonRef}>
                    <button
                      className="button-to-link"
                      onClick={deleteCommentHandler}
                    >
                      Delete Comment
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="comment-interact">
          <Moment fromNow>{date}</Moment>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
