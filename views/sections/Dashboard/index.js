// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "components/Button";
import InstaProfilePage from "sections/InstaProfilePage";
import { openPopup } from "ducks/connectAccPopup";
import type { Props, State } from "./types";

class Dashboard extends Component<Props, State> {
  render() {
    const { accList } = this.props;

    return (
      <section className="dashboard">
        {accList !== null &&
          (accList.length ? (
            <div className="profile">
              <InstaProfilePage username={this.props.username} />
            </div>
          ) : (
            <div className="dashboard__empty">
              <h3>User has no connected accounts</h3>
              <Button
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
