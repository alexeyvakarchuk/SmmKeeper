// @flow

import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import NavLink from "components/NavLink";
import ToDoList from "icons/ToDoList";
import Settings from "icons/Settings";
import PieChart from "icons/PieChart";
import { connect } from "react-redux";
import { openPopup } from "ducks/connectAccPopup";
import { withRouter } from "next/router";
import type { State, Props } from "./types";

class LeftBar extends Component<Props, State> {
  render() {
    const { accList } = this.props;

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
              {accList.map(({ profilePic, username, status }) => {
                let statusClassName = "";

                switch (status) {
                  case "Active":
                    statusClassName = "acclist__item-status_green";
                    break;

                  case "CheckpointRequired":
                    statusClassName = "acclist__item-status_yellow";
                    break;

                  case "RateLimited":
                    statusClassName = "acclist__item-status_red";
                    break;

                  case "FollowsLimitExceeded":
                    statusClassName = "acclist__item-status_yellow";
                    break;

                  case "PasswordWasChanged":
                    statusClassName = "acclist__item-status_yellow";
                    break;
                }

                return (
                  <NavLink
                    route="dashboard-with-username"
                    params={{ username }}
                    className="acclist__item"
                    activeClassName="acclist__item_active"
                  >
                    <div className="acclist__avatar">
                      <img src={profilePic} alt="Profile picture" />

                      <div
                        className={`acclist__item-status ${statusClassName}`}
                      >
                        <div className="status" data-tip={status} />
                        <ReactTooltip place="right" effect="solid" />
                      </div>
                    </div>
                  </NavLink>
                );
              })}
              <button className="acclist__add" onClick={this.props.openPopup} />
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

export default withRouter(
  connect(
    ({ inst: { accList, error } }) => ({
      accList
    }),
    dispatch => ({
      openPopup: () => dispatch(openPopup())
    })
  )(LeftBar)
);
