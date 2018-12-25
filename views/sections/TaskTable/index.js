import React, { Component } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

export default class TaskTable extends Component {
  state = {
    selectedOption: null
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  render() {
    const { selectedOption } = this.state;

    return (
      <section className="task-table">
        <div className="task-table__filter">
          <Select
            className="task-select"
            classNamePrefix="task-select"
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
            placeholder={"Bulk action"}
          />
          <button className="btn-task">Add new task</button>
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
