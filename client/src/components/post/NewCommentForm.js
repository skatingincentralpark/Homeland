import React, { useState } from "react";
import nl2br from "react-nl2br";

import { useDispatch } from "react-redux";
import { addComment } from "../../store/post/post-actions";

import TextArea from "../layout/TextArea";

const NewCommentForm = ({ postId, profilepicture, socket }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = nl2br(text);
    dispatch(addComment(postId, formData, socket));
    setText("");
  };

  return (
    <div className="text-input text-input-top">
      <div className="post-avatar">
        <img src={profilepicture} alt="user avatar" />
      </div>
      <form onSubmit={onSubmit}>
        <TextArea
          setText={setText}
          value={text}
          placeholder="Create a comment..."
        />
        <button className="link-button text-form">Post</button>
      </form>
    </div>
  );
};

export default NewCommentForm;
