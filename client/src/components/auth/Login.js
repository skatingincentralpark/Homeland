import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/auth/auth-actions";
import { getNotifications } from "../../store/notification/notification-actions";

import SkeletonImage2 from "../skeleton/SkeletonImage2";
import Logo from "../../static/svg/logo.svg";

const Login = () => {
  const email = useRef();
  const password = useRef();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(login(email.current.value, password.current.value));
    dispatch(getNotifications());
  };

  // Loading
  // if (loading) return <h1 className="p-1 mt-2">Loading...</h1>;

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  return (
    <>
      <main className="registerlogin-container">
        <div className="registerlogin register">
          <div className="thumbnail-large">
            <SkeletonImage2 />
          </div>
          <div className="registerlogin-right">
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">To experience Homeland</p>
            <form
              className="form"
              action="create-profile.html"
              onSubmit={onSubmit}
            >
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  required
                  ref={email}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  minLength="6"
                  required
                  ref={password}
                />
              </div>

              <input
                type="submit"
                className="link-button w-100 mb-2"
                value="Login"
              />
            </form>
            <p className="my-1">
              Don't have an account?{" "}
              <b>
                <Link to="/register">Sign up</Link>
              </b>
            </p>
            <small className="gray">
              By clicking sign in you agree to our Bla, Bla Policy and Blabla
              Policy. You may receive Bla notifications from us and can opt out
              at any time.
            </small>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
