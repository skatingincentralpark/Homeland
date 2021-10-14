import React, { useState } from "react";
import nl2br from "react-nl2br";
import Image from "react-graceful-image";

import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../store/post/post-actions";

import Camera from "../../static/svg/camera.svg";
import TextArea from "../layout/TextArea";

const NewPostForm = (props) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.ui);

  const [text, setText] = useState("");
  const [postImage, setPostImage] = useState();

  const onSubmit = (e) => {
    e.preventDefault();
    const convertText = nl2br(text);
    dispatch(addPost({ text: convertText, postImage: postImage }));
    setText("");
    setPostImage("");
  };

  return (
    <div className="profile-item-container" disabled={loading}>
      <div className="text-input new-post">
        <div className="text-input-top">
          <div className="post-avatar">
            <Image src={props.profilepicture} />
          </div>
          <form>
            <TextArea setText={setText} value={text} />
            <button onClick={onSubmit} className="link-button text-form">
              Post
            </button>
          </form>
        </div>
        <hr />
        <div className="image-upload">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => {
              setPostImage(e.target.files[0]);
            }}
          />
          <label htmlFor="file">
            <img src={Camera} alt="" />
            Add a photo
          </label>
          {postImage && (
            <div className="thumbnails">
              <img src={URL.createObjectURL(postImage)} alt="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
