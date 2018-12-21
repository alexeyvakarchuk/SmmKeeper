// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import GradientButton from "components/GradientButton";
import InstaProfilePage from "sections/InstaProfilePage";
import TaskTable from "sections/TaskTable";
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
              <TaskTable />
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
