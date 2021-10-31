import React from "react";
import { Link, Redirect } from "react-router-dom";

import { useSelector } from "react-redux";

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  return (
    <main className="registerlogin-container">
      <div className="test-landing">
        <h1 className="landing-logo">
          Homeland
          {/* <sup>&copy;</sup> */}
        </h1>
        <div className="p-3">
          <div className="landing-bottom">
            <h2>A fullstack (MERN), social-media application. </h2>
            <p className="pt-2">Key features include:</p>
            <ul>
              <li>
                Dynamic content /w <b>MongoDB</b>
              </li>
              <li>
                Authentication /w <b>JWT & Bcrypt</b>
              </li>
              <li>
                Photo uploads /w <b>Cloudinary</b>
              </li>
              <li>
                Super fast /w <b>React</b>
              </li>
            </ul>

            <small className="mt-2 block">
              <Link to="/">
                Please click here if you want to quickly view the app.
              </Link>
            </small>
            <div className="landing-buttons">
              <Link to="/register" className="bg-gray2 link-button mb-1 mt-2">
                Sign Up
              </Link>
              <Link to="/login" className="bg-gray2 link-button">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
