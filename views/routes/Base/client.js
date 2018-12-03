import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import HomePage from "pages/HomePage";
import Auth from "pages/Auth";
import Internal from "pages/Internal";
import NoMatch from "pages/NoMatch";
import AuthSuccess from "pages/AuthSuccess";

const BaseRoutes = ({ store, location }) => {
  return (
    <Switch>
      <PublicRoute exact path="/" render={() => <HomePage />} store={store} />
      <PublicRoute
        exact
        path="/sign-in"
        render={() => <Auth formState="SignIn" />}
        store={store}
      />
      <PublicRoute
        exact
        path="/sign-up"
        render={() => <Auth formState="SignUp" />}
        store={store}
      />
      <Route
        exact
        path="/auth/success"
        render={() => <AuthSuccess />}
        store={store}
      />
      <PrivateRoute path="/" render={() => <Internal />} store={store} />
      <Route component={NoMatch} />
    </Switch>
  );
};

export default BaseRoutes;
