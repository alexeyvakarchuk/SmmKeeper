// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import GradientButton from "components/GradientButton";
import InstaProfilePage from "sections/InstaProfilePage";
import { openPopup } from "ducks/connectAccPopup";
import type { Props, State } from "./types";

class Dashboard extends Component<Props, State> {
  state = {
    popupVisible: false
  };

  render() {
    const { accList } = this.props;

    const connectedAccounts = [];

    // const shouldRedirect =
    //   // $FlowFixMe
    //   this.props.match.url !== location.pathname ||
    //   location.pathname === "/app";

    return (
      <section className="dashboard">
        {accList !== null &&
          (accList.length ? (
            <div className="profile">
              {
                //accList.map(({ username }) => {
                // const render = username => () => (
                //   <InstaProfilePage username={username} />
                // );
                // return (
                //   <Route
                //     path={`/app/${username}`}
                //     render={render(username)}
                //   />
                // );
                //})
              }
              {/* {shouldRedirect && (
                  <Redirect to={`/app/${accList[0].username}`} />
                )} */}
              <InstaProfilePage username={this.props.username} />
            </div>
          ) : (
            <div className="dashboard__empty">
              <h3>User has no connected accounts</h3>
              <GradientButton
                handleClick={this.props.openPopup}
                value={"Connect account"}
              />
            </div>
          ))}
      </section>
    );
  }
}

export default connect(
  ({ inst: { accList } }) => ({
    accList
  }),
  dispatch => ({
    openPopup: () => dispatch(openPopup())
  })
)(Dashboard);
