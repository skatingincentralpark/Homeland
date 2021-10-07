import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setAlert } from "../../store/alert/alert-actions";
import { register, logout } from "../../store/auth/auth-actions";

const Register = () => {
  const [image, setImage] = useState("");

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const password2 = useRef();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loading = useSelector((state) => state.auth.loading);

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
    <div className="registerlogin register">
      <div className="registerlogin-left">
        <div className="registerlogin-image"></div>
      </div>
      <div className="registerlogin-right">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead mb-5">
          <i className="fas fa-user"></i> Create Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              ref={name}
              // required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              ref={email}
              // required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              ref={password}
              // required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              ref={password2}
              // required
            />
          </div>
          <input
            type="submit"
            className="link-button w-100 mb-2"
            value="Register"
          />
        </form>
        <p className="lead">
          Already have an account?{" "}
          <b>
            <Link to="/login">Sign In</Link>
          </b>
        </p>
        <small className="terms">
          By clicking sign up you agree to our Bla, Bla Policy and Blabla
          Policy. You may receive Bla notifications from us and can opt out at
          any time.
        </small>
      </div>
    </div>
  );
};

export default Register;
