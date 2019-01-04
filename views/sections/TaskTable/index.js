// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { openPopup } from "ducks/createTaskPopup";
import Dropdown from "components/Dropdown";
import TaskTableRow from "components/TaskTableRow";
import Check from "icons/Check";
import type { Props, State } from "./types";

class TaskTable extends PureComponent<Props, State> {
  state = {
    selectedAction: null,
    selectedFilter: null,
    selectedTasks: []
  };

  handleChange = option => value => {
    this.setState({ [option]: value });
  };

  handleRowSelect = (_id: string) => {
    this.setState({
      selectedTasks: [...this.state.selectedTasks, _id]
    });
  };

  handleRowDeselect = (_id: string) => {
    this.setState({
      selectedTasks: this.state.selectedTasks.filter(el => el !== _id)
    });
  };

  handleSelectAll = () => {
    if (this.props.tasksList) {
      this.setState({ selectedTasks: this.props.tasksList.map(el => el._id) });
    }
  };

  handleDeselectAll = () => {
    if (this.props.tasksList) {
      this.setState({ selectedTasks: [] });
    }
  };

  handleTheadCheckboxClick = () => {
    if (
      this.props.tasksList &&
      this.state.selectedTasks.length === this.props.tasksList.length
    ) {
      this.handleDeselectAll();
    } else {
      this.handleSelectAll();
    }
  };

  render() {
    const { selectedAction, selectedFilter } = this.state;
    const { tasksList } = this.props;

    const tasks =
      tasksList !== null && tasksList.length
        ? tasksList.filter(el => el.username === this.props.username)
        : [];

    const optionsAction = [
      { value: "PAUSE", label: "PAUSE" },
      { value: "CONTINUE", label: "CONTINUE" },
      { value: "DELETE", label: "DELETE" }
    ];
    const optionsFilter = [
      { value: "Follow", label: "Follow" },
      { value: "Follow & Like", label: "Follow & Like" },
      { value: "Like", label: "Like" },
      { value: "Unfollow", label: "Unfollow" }
      // { value: "Direct", label: "Direct" }
    ];

    const TheadCheckboxClassName = `table__checkbox ${
      this.props.tasksList &&
      this.state.selectedTasks.length === this.props.tasksList.length
        ? "table__checkbox_checked"
        : ""
    }`;

    const TaskButtonClassName = `btn-task btn-task_ml10 btn-task_light ${
      this.state.selectedAction &&
      this.state.selectedTasks &&
      this.state.selectedTasks.length
        ? "btn-task_light-active"
        : ""
    }`;

    return (
      <section className="task-table">
        <div className="task-table__filter">
          <div className="task-table__filter-left">
            {!!tasks.length && (
              <>
                <Dropdown
                  instanceId="task-select"
                  value={selectedAction}
                  onChange={this.handleChange("selectedAction")}
                  options={optionsAction}
                  placeholder={"Bulk action"}
                />
                <button className={TaskButtonClassName}>Apply</button>
              </>
            )}
          </div>
          <div className="task-table__filter-right">
            {!!tasks.length && (
              <>
                <span className="task-table__filter-caption">Filter:</span>
                <Dropdown
                  instanceId="task-select2"
                  value={selectedFilter}
                  onChange={this.handleChange("selectedFilter")}
                  options={optionsFilter}
                  placeholder={"All actions"}
                />
              </>
            )}

            <button className="btn-task" onClick={this.props.openPopup}>
              Add new task
            </button>
          </div>
        </div>
        {tasks.length ? (
          <div className="table">
            <div className="table__head">
              <span className="table__head-caption">
                <div
                  className={TheadCheckboxClassName}
                  onClick={this.handleTheadCheckboxClick}
                >
                  <Check />
                </div>
              </span>
              <span className="table__head-caption">Status</span>
              {/* <span className="table__head-caption">Profile</span> */}
              <span className="table__head-caption">Action type</span>
              <span className="table__head-caption">Source</span>
              <span className="table__head-caption">Audience</span>
              <span className="table__head-caption">Done</span>
              <span className="table__head-caption">Result</span>
              <span className="table__head-caption">Conversion</span>
              <span className="table__head-caption" />
            </div>
            {tasks
              .reverse()
              .map(
                (
                  {
                    _id,
                    unteractionsNum,
                    sourceUsername,
                    type,
                    status,
                    startDate
                  },
                  index
                ) => (
                  <TaskTableRow
                    _id={_id}
                    unteractionsNum={unteractionsNum}
                    sourceUsername={sourceUsername}
                    type={type}
                    status={status}
                    startDate={startDate}
                    handleRowSelect={this.handleRowSelect}
                    handleRowDeselect={this.handleRowDeselect}
                    selectedTasks={this.state.selectedTasks}
                  />
                )
              )}
          </div>
        ) : (
          false
        )}
      </section>
    );
  }
}

export default connect(
  ({ inst: { tasksList } }) => ({
    tasksList
  }),
  dispatch => ({
    openPopup: () => dispatch(openPopup())
  })
)(TaskTable);
