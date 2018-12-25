// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { openPopup } from "ducks/startTaskPopup";
import Dropdown from "components/Dropdown";
import type { Props, State } from "./types";

class TaskTable extends PureComponent<Props, State> {
  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    const { selectedOption } = this.state;
    const { tasksList } = this.props;

    const optionsAction = [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" }
    ];
    const optionsFilter = [
      { value: "Follow", label: "Follow" },
      { value: "Follow & Like", label: "Follow & Like" },
      { value: "Unfollow", label: "Unfollow" },
      { value: "Like", label: "Like" },
      { value: "Direct", label: "Direct" }
    ];

    return (
      <section className="task-table">
        <div className="task-table__filter">
          <div className="task-table__filter-left">
            <Dropdown
              instanceId="task-select"
              value={selectedOption}
              onChange={this.handleChange}
              options={optionsAction}
              placeholder={"Bulk action"}
            />
            <button className="btn-task btn-task_light btn-task_ml10">
              Apply
            </button>
          </div>
          <div className="task-table__filter-right">
            <span className="task-table__filter-caption">Filter:</span>
            <Dropdown
              instanceId="task-select2"
              value={selectedOption}
              onChange={this.handleChange}
              options={optionsFilter}
              placeholder={"All actions"}
            />
            <button className="btn-task" onClick={this.props.openPopup}>
              Add new task
            </button>
          </div>
        </div>
        {tasksList !== null && tasksList.length ? (
          <table className="task-table__table table">
            <thead className="table__thead">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="table__checkbox"
                    id="thisid"
                  />
                  <label htmlFor="thisid" className="table__checkbox-label" />
                </th>
                <th>Status</th>
                <th>Profile</th>
                <th>Action type</th>
                <th>Source</th>
                <th>Audience</th>
                <th>Done</th>
                <th>Result</th>
                <th>Conversion</th>
                <th />
              </tr>
            </thead>
            <tbody className="table__tbody">
              {tasksList
                .filter(el => el.username === this.props.username)
                .map(
                  ({
                    unteractionsNum,
                    sourceUsername,
                    type,
                    status,
                    startDate
                  }) => (
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          className="table__checkbox"
                          id="thisid2"
                        />
                        <label
                          htmlFor="thisid2"
                          className="table__checkbox-label"
                        />
                      </td>
                      <td>{status === 1 ? "Active" : "Paused"}</td>
                      <td>{this.props.username}</td>
                      <td>{type}</td>
                      <td>{sourceUsername}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{unteractionsNum}</td>
                      <td>-</td>
                      <td />
                    </tr>
                  )
                )}
            </tbody>
          </table>
        ) : (
          false
        )}

        {/* <div className="tasksTable">
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
          </div> */}
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
