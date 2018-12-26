// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { openPopup } from "ducks/startTaskPopup";
import Dropdown from "components/Dropdown";
import OptionDots from "icons/OptionDots";
import type { Props, State } from "./types";

class TaskTable extends PureComponent<Props, State> {
  state = {
    selectedAction: null,
    selectedFilter: null
  };

  handleChange = option => value => {
    this.setState({ [option]: value });
  };

  render() {
    const { selectedAction, selectedFilter } = this.state;
    const { tasksList } = this.props;

    const optionsAction = [
      { value: "STOP", label: "STOP" },
      { value: "PAUSE", label: "PAUSE" },
      { value: "DONE", label: "DONE" }
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
              value={selectedAction}
              onChange={this.handleChange("selectedAction")}
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
              value={selectedFilter}
              onChange={this.handleChange("selectedFilter")}
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
                  (
                    {
                      unteractionsNum,
                      sourceUsername,
                      type,
                      status,
                      startDate
                    },
                    index
                  ) => (
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          className="table__checkbox"
                          id={index}
                        />
                        <label
                          htmlFor={index}
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
        <div className="table">
          <div className="table__head">
            <span className="table__head-caption">
              <input type="checkbox" className="table__checkbox" id="thisid3" />
              <label htmlFor="thisid3" className="table__checkbox-label" />
            </span>
            <span className="table__head-caption">Status</span>
            <span className="table__head-caption">Profile</span>
            <span className="table__head-caption">Action type</span>
            <span className="table__head-caption">Source</span>
            <span className="table__head-caption">Audience</span>
            <span className="table__head-caption">Done</span>
            <span className="table__head-caption">Result</span>
            <span className="table__head-caption">Conversion</span>
            <span className="table__head-caption" />
          </div>
          <div className="table__task">
            <span className="table__task-label">
              <input type="checkbox" className="table__checkbox" id="thisid4" />
              <label htmlFor="thisid4" className="table__checkbox-label" />
            </span>
            <span className="table__task-label">STOP</span>
            <span className="table__task-label table__task-label_username">
              nikere.design adgmaoirgainrgipuanriguairo
            </span>
            <span className="table__task-label">Follow & 1 Like</span>
            <span className="table__task-label">@nikere.co</span>
            <span className="table__task-label">15 260</span>
            <span className="table__task-label">2690</span>
            <span className="table__task-label">243</span>
            <span className="table__task-label">9.5%</span>
            <span className="table__task-label">
              <OptionDots />
            </span>
          </div>
        </div>
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
