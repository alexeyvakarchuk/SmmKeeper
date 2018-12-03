// @flow

import React, { PureComponent } from "react";
import Logo from "icons/Logo";
import Clock from "icons/Clock";
import Bell from "icons/Bell";
import BulletsMenu from "icons/BulletsMenu";
import Pause from "icons/Pause";
import Play from "icons/Play";
import ArrowDown from "icons/ArrowDown";
import { signOut } from "ducks/auth";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import store from "store";
import type { State, Props } from "./types";

class TopBar extends PureComponent<Props, State> {
  state = {
    settingsDropdownVisible: false,
    timersDropdownVisible: false
  };

  toggleDropdownVisibility = dropdownName => () => {
    this.state[dropdownName]
      ? this.setState({ [dropdownName]: false })
      : this.setState({ [dropdownName]: true });
  };

  render() {
    const { user } = this.props;

    const settingsDropdownClassName = this.state.settingsDropdownVisible
      ? "dropdown dropdown_visible"
      : "dropdown";

    const timersDropdownClassName = this.state.timersDropdownVisible
      ? "timers-list dropdown dropdown_visible"
      : "timers-list dropdown";

    return (
      <div className="topbar">
        <div className="topbar__leftside">
          <Link to="/app" className="topbar__logo">
            <Logo />
          </Link>
          <span className="topbar__caption">
            “Your personal social media booster”
          </span>
        </div>
        <div className="topbar__controls">
          <div className="topbar__timers active">
            <span
              className="topbar__timers-icon"
              onClick={this.toggleDropdownVisibility("timersDropdownVisible")}
            >
              <Bell counter={1} />
              {/* <Clock /> */}
            </span>
            {/* <span
              className="topbar__timers-counter"
              onClick={this.toggleDropdownVisibility("timersDropdownVisible")}
            >
              2
            </span> */}
            <div className={timersDropdownClassName}>
              <div className="timer">
                <div className="timer__name">Task 1</div>
                <div className="timer__pause-button">
                  <Pause />
                </div>
                <div className="timer__time">14:12:01</div>
              </div>
            </div>
          </div>

          <div className="topbar__name">
            <img
              src="https://instagram.fdnk2-1.fna.fbcdn.net/vp/0ce58743f1cfa80bc494ecc7544224a9/5CB15748/t51.2885-19/s320x320/46060645_2167155603535731_8382210895320711168_n.jpg"
              alt=""
              className="topbar__photo"
            />
            <span
              className="topbar__name-label"
              onClick={this.toggleDropdownVisibility("settingsDropdownVisible")}
            >
              {user && user.email}
            </span>
            <span
              className="topbar__name-icon"
              onClick={this.toggleDropdownVisibility("settingsDropdownVisible")}
            >
              <BulletsMenu />
            </span>
            <div
              className={settingsDropdownClassName}
              onClick={() => store.dispatch(signOut())}
            >
              Sign Out
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth: { user } }) => ({ user }))(TopBar);
