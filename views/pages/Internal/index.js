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

export default Internal;
