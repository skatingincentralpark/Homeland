import React, { useState } from "react";

const TextArea = (props) => {
  const [style, setStyle] = useState({ height: "32px" });

  const onChange = async (e) => {
    props.setText(e.target.value);
    await setStyle({ height: "auto" });
    setStyle({ height: `${e.target.scrollHeight}px` });
  };

  const submitHandler = async (e) => {
    props.onSubmit(e);
    props.setText(e.target.value);
    await setStyle({ height: "auto" });
    setStyle({ height: `${e.target.scrollHeight}px` });
  };

  return (
    <>
      <textarea
        style={style}
        className="border-none textarea"
        value={props.value}
        cols="30"
        rows="1"
        placeholder={props.placeholder || "Create a post..."}
        onChange={onChange}
      />
      <button onClick={submitHandler} className="link-button text-form">
        {props.buttonText}
      </button>
    </>
  );
};

export default TextArea;
