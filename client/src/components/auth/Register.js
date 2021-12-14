import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setAlert } from "../../store/alert/alert-actions";
import { register, logout } from "../../store/auth/auth-actions";

import Camera from "../../static/svg/camera.svg";
import PreAuthHeader from "../layout/PreAuthHeader";
import SkeletonImage2 from "../skeleton/SkeletonImage2";

const Register = () => {
  const [image, setImage] = useState("");

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const password2 = useRef();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password.current.value !== password2.current.value) {
      dispatch(setAlert("Passwords do not match", "danger"));
    } else {
      dispatch(
        register({
          name: name.current.value,
          email: email.current.value,
          password: password.current.value,
          image: image,
        })
      );
    }
  };

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  return (
    <>
      <main className="px-1-5">
        <PreAuthHeader heading="Create a new account" />
        <div className="pre-auth-container">
          <div className="profile-pic-preview">
            {profilePic ? (
              <img src={URL.createObjectURL(profilePic)} alt="" />
            ) : (
              <SkeletonImage2 />
            )}
          </div>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                name="name"
                ref={name}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                ref={email}
                required
              />
            </div>
            <div className="image-upload mb-1">
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                  setImage(e.target.files[0]);
                }}
              />
              <label htmlFor="file">
                <img src={Camera} alt="" />
                Add a photo
              </label>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                ref={password}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                ref={password2}
                required
              />
            </div>
            <input
              type="submit"
              className="link-button w-100 mb-2 btn-success"
              value="Register"
            />
          </form>
          <hr />
          <Link to="/login" className="link-button w-100 bg-black white mb-05">
            Have an account? Sign in
          </Link>
          <Link to="/" className="link-button w-100 btn-neutral">
            About
          </Link>
        </div>
        <div className="disclaimer">
          By clicking sign up you agree to our Terms, Data Policy and Cookie
          Policy.
        </div>
      </main>
    </>
  );
};

export default Register;
