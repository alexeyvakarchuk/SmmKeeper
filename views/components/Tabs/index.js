// @flow

import React, { PureComponent } from "react";
import type { Props, State } from "./types";

export default class Tabs extends PureComponent<Props, State> {
  render() {
    const { tabs, activeTab, handleChangeTab } = this.props;

    return (
      <div className="limits__split-btn">
        <div
          className={`limits__active-tab ${
            activeTab === 1
              ? "limits__active-tab_first"
              : "limits__active-tab_second"
          }`}
        />

        {tabs.map(tab => (
          <button
            className={`limits__btn ${
              tab.id === activeTab ? "limits__btn_active" : ""
            }`}
            onClick={() => handleChangeTab(tab.id)}
          >
            {tab.value}
          </button>
        ))}

        {/* <button className="limits__btn">all profiles</button>
        <button className="limits__btn limits__btn_active">current</button> */}
      </div>
    );
  }
}
