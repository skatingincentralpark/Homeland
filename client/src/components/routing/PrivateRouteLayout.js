import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouteLayout = ({ path, component }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated && !loading) {
    return <Redirect to="/login" />;
  }
  return <Route exact path={path} component={component} />;
};

export default PrivateRouteLayout;
