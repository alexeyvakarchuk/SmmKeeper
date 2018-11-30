// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Route, Switch, Redirect } from "react-router-dom";
import ToDoInput from "components/ToDoInput";
import TaskCard from "components/TaskCard";
import GradientButton from "components/GradientButton";
import InstaProfilePage from "sections/InstaProfilePage";
import { openPopup, closePopup } from "ducks/connectAccPopup";
import store from "store";
import type { Props, State } from "./types";

class Dashboard extends Component<Props, State> {
  state = {
    popupVisible: false
  };

  render() {
    const { accList } = this.props;

    const connectedAccounts = [];

    const shouldRedirect =
      // $FlowFixMe
      this.props.match.url !== location.pathname ||
      location.pathname === "/app";

    return (
      <section className="dashboard">
        {accList !== null &&
          (accList.length ? (
            <div className="profile">
              <Switch>
                {accList.map(({ username }) => {
                  const render = username => () => (
                    <InstaProfilePage username={username} />
                  );

                  return (
                    <Route
                      path={`/app/${username}`}
                      render={render(username)}
                    />
                  );
                })}
                {shouldRedirect && (
                  <Redirect to={`/app/${accList[0].username}`} />
                )}
              </Switch>
            </div>
          ) : (
            <div className="dashboard__empty">
              <h3>User has no connected accounts</h3>
              <GradientButton
                handleClick={() => store.dispatch(openPopup())}
                value={"Connect account"}
              />
            </div>
          ))}
      </section>
    );
  }
}

export default connect(({ inst: { accList } }) => ({
  accList
}))(Dashboard);
