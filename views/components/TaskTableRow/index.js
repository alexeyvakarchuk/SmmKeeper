// @flow

import React, { PureComponent } from "react";
import OptionDots from "icons/OptionDots";
import type { Props, State } from "./types";

export default class TaskTableRow extends PureComponent<Props, State> {
  toggleRowCheck = (_id: string) => {
    if (this.props.selectedTasks.indexOf(_id) !== -1) {
      this.props.handleRowDeselect(_id);
    } else {
      this.props.handleRowSelect(_id);
    }
  };

  render() {
    const {
      _id,
      unteractionsNum,
      sourceUsername,
      type,
      status,
      startDate
    } = this.props;

    const getStatus = (statusNum: number) => {
      switch (statusNum) {
        case 1:
          return "ACTIVE";

        case 0:
          return "PAUSED";

        case -1:
          return "STOPPED";

        default:
          return "Invalid";
      }
    };

    const getStatusTextColor = (statusNum: number) => {
      switch (statusNum) {
        case 1:
          return "table__task-label_green";

        case -1:
          return "table__task-label_red";

        case 0:
          return "table__task-label_grey";

        default:
          return "";
      }
    };

    return (
      <div className="table__task">
        <span
          className="table__task-label"
          onClick={() => this.toggleRowCheck(_id)}
        >
          <div
            className={`table__checkbox ${
              this.props.selectedTasks.indexOf(_id) !== -1
                ? "table__checkbox_checked"
                : ""
            }`}
          />
        </span>
        <span className={`table__task-label ${getStatusTextColor(status)}`}>
          {getStatus(status)}
        </span>
        {/* <span className="table__task-label table__task-label_username">
            nikere.design adgmaoirgainrgipuanriguairo
          </span> */}
        <span className="table__task-label">{type}</span>
        <span className="table__task-label">{sourceUsername}</span>
        <span className="table__task-label">-</span>
        <span className="table__task-label">{unteractionsNum}</span>
        <span className="table__task-label">-</span>
        <span className="table__task-label">-</span>
        <span className="table__task-label">
          <OptionDots />
        </span>
      </div>
    );
  }
}
