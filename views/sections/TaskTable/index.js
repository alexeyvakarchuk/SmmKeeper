import React, { Component } from "react";
import Dropdown from "components/Dropdown";

export default class TaskTable extends Component {
  state = {
    selectedOption: null,
    menuIsOpen: false
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    const { selectedOption } = this.state;

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
            <button className="btn-task btn-task_ml20">Add new task</button>
          </div>
        </div>
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
            <tr>
              <td>
                <input
                  type="checkbox"
                  className="table__checkbox"
                  id="thisid2"
                />
                <label htmlFor="thisid2" className="table__checkbox-label" />
              </td>
              <td>STOP</td>
              <td>nikere.design</td>
              <td>Follow & 1 Like</td>
              <td>@nikere.co</td>
              <td>15 260</td>
              <td>2690</td>
              <td>243</td>
              <td>9.5%</td>
              <td />
            </tr>
          </tbody>
        </table>
      </section>
    );
  }
}
