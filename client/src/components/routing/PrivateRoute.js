import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ path, component: Component, ...rest }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated && !loading) {
    return <Redirect to="/login" />;
  }

  return (
    <Route exact path={path}>
      <Component {...rest} />
    </Route>
  );
};

export default PrivateRoute;
