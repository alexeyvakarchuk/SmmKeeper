// @flow

import React, { Component } from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import TopBar from "components/TopBar";
import LeftBar from "components/LeftBar";
import { socketConnect } from "ducks/socket";
import { fetchAccs } from "ducks/inst";
import { checkPasswordExistence } from "ducks/password";
import Dashboard from "pages/Dashboard";
import NoMatch from "pages/NoMatch";
import Settings from "pages/Settings";
import Metrics from "pages/Metrics";
import ConnectAccPopup from "components/ConnectAccPopup";
import { connect } from "react-redux";
import { runSaga } from "redux-saga";
import { withRouter } from "react-router-dom";
import { fetchAccsSaga } from "ducks/inst";
import type { Props, State } from "./types";

class Internal extends Component<Props, State> {
  static loadData(store, match, url, params) {
    // see /src/views/StaticPageWithDataDeps for more info on this
    console.log("loading data");
    // console.log(store);
    // store.dispatch(socketConnect());
    return runSaga(
      {
        subscribe: () => {
          return () => {};
        },
        dispatch: store.dispatch,
        getState: store.getState
      },
      fetchAccsSaga
    );
    // return store.dispatch(fetchAccs());
    // store.dispatch(checkPasswordExistence());
  }

  componentDidMount() {
    console.log(this.props.acclist);
    if (!this.props.acclist) {
      this.props.socketConnect();
      this.props.fetchAccs();
      this.props.checkPasswordExistence();
    }
  }

  render() {
    return (
      <section className="internal">
        <TopBar />
        <LeftBar location={this.props.location} />
        {/* <Main /> */}

        <div className="main">
          <Switch>
            <Route path="/app" component={Dashboard} />
            <Route path="/metrics" component={Metrics} />
            <Route path="/settings" component={Settings} />
            <Redirect to="/app" />
          </Switch>
        </div>
        {/* <button
          onClick={() => store.dispatch(signOut())}
          className="gradientButton"
        >
          Sign out
        </button> */}
        <ConnectAccPopup />
      </section>
    );
  }
}

export default withRouter(
  connect(
    ({ inst: { accList } }) => ({
      accList
    }),
    dispatch => ({
      socketConnect: () => dispatch(socketConnect()),
      fetchAccs: () => dispatch(fetchAccs()),
      checkPasswordExistence: () => dispatch(checkPasswordExistence())
    })
  )(Internal)
);
