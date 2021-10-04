import React, { useRef, useState } from "react";
import axios from "axios";

const TempRegister = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [image, setImage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "profile-pictures");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dkgzyvlpc/image/upload",
      formData
    );

    console.log(res.data.url);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post("/api/users", body, config);

      console.log("successfully registered");
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="mt-5">
      <form onSubmit={submit}>
        <input type="text" placeholder="Name" name="name" ref={nameRef} />
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          ref={emailRef}
        />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          ref={passwordRef}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default TempRegister;
