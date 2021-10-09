import React, { useState } from "react";

const TextArea = (props) => {
  const [style, setStyle] = useState({ height: "32px" });

  const onChange = async (e) => {
    props.setText(e.target.value);
    await setStyle({ height: "auto" });
    setStyle({ height: `${e.target.scrollHeight}px` });
  };

  return (
    <textarea
      style={style}
      className="border-none"
      value={props.value}
      cols="30"
      rows="1"
      placeholder="Create a post..."
      onChange={onChange}
    />
  );
};

export default TextArea;
