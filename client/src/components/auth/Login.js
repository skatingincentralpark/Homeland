import React, { useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../store/auth/auth-actions";
import { getNotifications } from "../../store/notification/notification-actions";

import PreAuthHeader from "../layout/PreAuthHeader";

const Login = () => {
  const email = useRef();
  const password = useRef();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(login(email.current.value, password.current.value));
    dispatch(getNotifications());
  };

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  return (
    <main className="px-1-5">
      <PreAuthHeader heading="Sign in to Homeland" />
      <div className="pre-auth-container">
        <form className="form" action="create-profile.html" onSubmit={onSubmit}>
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
            className="link-button w-100 mb-2 btn-success"
            value="Sign In"
          />
        </form>
        <hr />
        <Link to="/register" className="link-button w-100 bg-black white mb-05">
          Create New Account
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
  );
};

export default Login;
