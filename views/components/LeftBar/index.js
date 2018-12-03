// @flow

import React, { PureComponent } from "react";
import { Link, NavLink } from "react-router-dom";
import ToDoList from "icons/ToDoList";
import Settings from "icons/Settings";
import PieChart from "icons/PieChart";
import { connect } from "react-redux";
import { openPopup } from "ducks/connectAccPopup";
import type { State, Props } from "./types";

class LeftBar extends PureComponent<Props, State> {
  render() {
    const { pathname, accList } = this.props;

    return (
      <div className="leftbar">
        {/* <Link to="/app" className="leftbar__logo logo">
          SM
        </Link> */}

        <div className="leftbar__name">Profiles</div>

        <div className="leftbar__menu">
          {/* <NavLink
            to="/app"
            className="leftbar__menu-item"
            activeClassName="active"
          >
            Account
          </NavLink> */}
          {accList !== null && accList.length ? (
            <div className="acclist">
              {accList.map(({ profilePic, username }) => (
                <NavLink
                  to={`/app/${username}`}
                  className="acclist__item"
                  activeClassName="acclist__item-active"
                >
                  <img src={profilePic} alt="Profile picture" />
                  {/* <span>@{username}</span> */}
                </NavLink>
              ))}
              <button className="acclist__add" onClick={this.props.openPopup}>
                +
              </button>
            </div>
          ) : (
            false
          )}
          {/* <NavLink
            to="/metrics"
            className="leftbar__menu-item"
            activeClassName="active"
          >
            <PieChart />
          </NavLink>
          <NavLink
            to="/settings"
            className="leftbar__menu-item"
            activeClassName="active"
          >
            <Settings />
          </NavLink> */}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ inst: { accList, error }, router: { location } }) => ({
    accList,
    pathname: location.pathname
  }),
  dispatch => ({
    openPopup: () => dispatch(openPopup())
  })
)(LeftBar);
