import React from "react";
import { Link, Redirect } from "react-router-dom";

import PreAuthHeader from "../layout/PreAuthHeader";

import { useSelector } from "react-redux";

const Landing = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  if (loading) return <></>;

  return (
    <>
      <PreAuthHeader heading="Welcome to Homeland" />
      <main className="px-1-5">
        <div className="pre-auth-container">
          <p>
            Homeland is a fullstack (MERN) social-media application. Please sign
            up with any dummy info and test out the application.
          </p>
          <br />
          <p>
            It might also be worth it to create another account and open an
            incognito window to see live updates for messaging and
            notifications.
          </p>
          <br />
          <p>
            Feel free to test the responsiveness on mobile and I would love to
            hear any feedback or bugs you encounter. Thanks for having a look.
          </p>
          <hr />
          <Link to="/login" className="link-button w-100 bg-black white mb-05">
            Sign into an Existing Account
          </Link>
          <Link to="/register" className="link-button w-100 bg-black white">
            Create New Account
          </Link>
        </div>
      </main>
    </>
  );
};

export default Landing;
