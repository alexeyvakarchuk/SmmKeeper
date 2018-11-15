// @flow

import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import ToDoList from "icons/ToDoList";
import Settings from "icons/Settings";
import PieChart from "icons/PieChart";
import { connect } from "react-redux";
import type { State, Props } from "./types";

class LeftBar extends PureComponent<Props, State> {
  render() {
    const { pathname } = this.props;

    const menuItems = [
      {
        icon: <ToDoList />,
        route: "/app"
      },
      {
        icon: <PieChart />,
        route: "/app/metrics"
      },
      {
        icon: <Settings />,
        route: "/app/settings"
      }
    ];

    return (
      <div className="leftbar">
        <Link to="/app" className="leftbar__logo logo">
          TK
        </Link>

        <ul className="leftbar__menu">
          {menuItems.map(({ icon, route }) => (
            <li
              className={`leftbar__menu-item ${
                pathname === route ? "active" : ""
              }`}
              key={route}
            >
              <Link to={route}>{icon}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(({ router: { location } }) => ({
  pathname: location.pathname
}))(LeftBar);
