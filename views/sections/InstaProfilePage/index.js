// @flow

import React, { PureComponent } from "react";
import type { Props, State } from "./types";
import GradientButton from "components/GradientButton";
import { startTask, fetchTasks } from "ducks/inst";
import { connect } from "react-redux";

class InstaProfilePage extends PureComponent<Props, State> {
  componentDidMount() {
    this.props.fetchTasks(this.props.username);
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      this.props.fetchTasks(this.props.username);
    }
  }

  render() {
    const { username, tasksList } = this.props;
    return (
      <div className="instaprofile">
        {/* <h1 className="instaprofile__name">@{username}</h1> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-3">
              <div className="panel panel-info">
                <div className="panel-info__name">{username}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-3">
              <div className="panel" />
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="panel" />
            </div>
          </div>
        </div>

        {/* <GradientButton
          handleClick={() =>
            store.dispatch(startTask({ username, type: "mf" }))
          }
          value={"Start massfollowing"}
        />

        {tasksList !== null && tasksList.length ? (
          <div className="tasksTable">
            {tasksList.map(
              ({
                unteractionsNum,
                sourceUsername,
                type,
                status,
                startDate
              }) => (
                <div className="tasksTable__row">Task:</div>
              )
            )}
          </div>
        ) : (
          false
        )} */}
      </div>
    );
  }
}

export default connect(
  ({ inst: { tasksList } }) => ({
    tasksList
  }),
  dispatch => ({
    fetchTasks: username => dispatch(fetchTasks({ username })),
    startTask: (username, type) => dispatch(startTask({ username, type }))
  })
)(InstaProfilePage);
