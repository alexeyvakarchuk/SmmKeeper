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
import { connect } from "react-redux";
import store from "store";

class Internal extends Component {
  componentDidMount() {
    store.dispatch(socketConnect());
    store.dispatch(fetchAccs());
    store.dispatch(checkPasswordExistence());
  }

  render() {
    return (
      <section className="internal">
        <TopBar />
        <LeftBar />
        {/* <Main /> */}

        <div className="main">
          <Switch>
            <Route exact path="/app" component={Dashboard} />
            <Route exact path="/app/metrics" component={Metrics} />
            <Route exact path="/app/settings" component={Settings} />
            <Redirect to="/app" />
          </Switch>
        </div>
        {/* <button
          onClick={() => store.dispatch(signOut())}
          className="gradientButton"
        >
          Sign out
        </button> */}
      </section>
    );
  }
}

export default Internal;
