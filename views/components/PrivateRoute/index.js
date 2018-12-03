// @flow

import React, { PureComponent } from "react";
import { Route, Redirect } from "react-router-dom";
import type { State, Props } from "./types";
import { fetchUserAuth } from "utils";
import { connect } from "react-redux";

class PrivateRoute extends PureComponent<Props, State> {
  state = {
    loading: true,
    auth: false
  };

  async componentDidMount() {
    try {
      if (this.props.user) {
        this.setState({ loading: false, auth: true });
      } else {
        const auth = await fetchUserAuth(this.props.store);

        this.setState({ loading: false, auth });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { render, ...rest } = this.props;

    return !this.state.loading ? (
      <Route
        render={props =>
          this.state.auth ? (
            render(props)
          ) : (
            <Redirect
              to={{
                pathname: "/sign-in",
                state: { from: this.props.location }
              }}
            />
          )
        }
      />
    ) : (
      false
    );
  }
}

export default connect(({ auth: { user } }) => ({ user }))(PrivateRoute);
