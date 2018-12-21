import React, { Component } from "react";

export default class TaskTable extends Component {
  render() {
    return (
      <section className="task-table">
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
