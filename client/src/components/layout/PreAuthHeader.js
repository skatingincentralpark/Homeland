import React from "react";
import { Link } from "react-router-dom";

import Logo from "../../static/svg/logo.svg";

import "./PreAuthHeader.css";

const PreAuthHeader = ({ heading }) => {
  return (
    <div className="pre-auth-header">
      <Link to="/">
        <img src={Logo} alt="logo" className="svg" />
      </Link>

      <h1>{heading}</h1>
    </div>
  );
};

export default PreAuthHeader;
