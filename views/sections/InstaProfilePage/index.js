// @flow

import React, { PureComponent } from "react";
import type { Props, State } from "./types";
import GradientButton from "components/GradientButton";
import { startTask, fetchTasks } from "ducks/inst";
import { connect } from "react-redux";
import store from "store";

class InstaProfilePage extends PureComponent<Props, State> {
  componentDidMount() {
    store.dispatch(fetchTasks({ username: this.props.username }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      store.dispatch(fetchTasks({ username: this.props.username }));
    }
  }

  render() {
    const { username, tasksList } = this.props;
    return (
      <div className="instaprofile">
        <h1 className="instaprofile__name">@{username}</h1>

        <GradientButton
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
        )}
      </div>
    );
  }
}

export default connect(({ inst: { tasksList } }) => ({
  tasksList
}))(InstaProfilePage);
