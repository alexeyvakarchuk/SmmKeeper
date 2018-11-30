import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Auth from "pages/Auth";
import Internal from "pages/Internal";
import NoMatch from "pages/NoMatch";
import AuthSuccess from "pages/AuthSuccess";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import store, { history } from "store";
import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import { fetchUserId } from "utils";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Switch>
              <PublicRoute exact path="/" render={() => <HomePage />} />
              <PublicRoute
                exact
                path="/sign-in"
                render={() => <Auth formState="SignIn" />}
              />
              <PublicRoute
                exact
                path="/sign-up"
                render={() => <Auth formState="SignUp" />}
              />
              <Route
                exact
                path="/auth/success"
                render={() => <AuthSuccess />}
              />
              <PrivateRoute
                path="/"
                render={props => <Internal location={props.location} />}
              />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}
