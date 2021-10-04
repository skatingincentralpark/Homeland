import React from "react";
import { Link, Redirect } from "react-router-dom";

import { useSelector } from "react-redux";

const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const loading = useSelector((state) => state.auth.loading);

  // Loading
  // if (loading) {
  //   return (
  //     <>
  //       <h1 className="p-1 mt-2">Loading...</h1>
  //     </>
  //   );
  // }

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Redirect to="/newsfeed" />;
  }

  return (
    <section className="registerlogin">
      <div className="landing">
        <div>
          <h1>Welcome to Homeland &#9733;</h1>
          <h2>A fullstack (MERN), social-media application. </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus nemo corrupti nihil vero, soluta nisi perspiciatis
            velit voluptates fugiat dolorem ipsam animi est inventore qui,
            dolorum quisquam consectetur provident possimus.
          </p>
          <br />
          <p>Key features include:</p>
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
          <div className="buttons">
            <Link to="/register" className="link-button mb-1 mt-2">
              Sign Up
            </Link>
            <Link to="/login" className="link-button">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
