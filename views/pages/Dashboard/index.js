// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import ToDoInput from "components/ToDoInput";
import TaskCard from "components/TaskCard";
import GradientButton from "components/GradientButton";
import ConnectAccPopup from "components/ConnectAccPopup";
import type { Props, State } from "./types";

class Dashboard extends Component<Props, State> {
  state = {
    popupVisible: false
  };

  changePopupVisibility = (popupVisible: boolean) =>
    this.setState({ popupVisible });

  render() {
    const { accList, progress } = this.props;

    const connectedAccounts = [];

    // const content = accList.length ? (
    //   "aaa"
    // ) : (
    //   <div className="dashboard__empty">
    //     <h3>User has no connected accounts</h3>
    //     <GradientButton
    //       handleClick={() => this.changePopupVisibility(true)}
    //       value={"Connect account"}
    //     />
    //     <ConnectAccPopup
    //       popupVisible={this.state.popupVisible}
    //       changePopupVisibility={this.changePopupVisibility}
    //     />
    //   </div>
    // );

    return (
      <section className="dashboard">
        {accList !== null &&
          (accList.length ? (
            <div className="left-bar">
              {accList.map(({ profilePic }) => (
                <div>
                  <img src={profilePic} alt="Profile picture" />
                </div>
              ))}
              <button
                className="dashboard__new-profile"
                onClick={() => this.changePopupVisibility(true)}
              >
                +
              </button>
            </div>
          ) : (
            <div className="dashboard__empty">
              <h3>User has no connected accounts</h3>
              <GradientButton
                handleClick={() => this.changePopupVisibility(true)}
                value={"Connect account"}
              />
              
            </div>
          ))}
          <ConnectAccPopup
                popupVisible={this.state.popupVisible}
                changePopupVisibility={this.changePopupVisibility}
              />
      </section>
    );
  }
}

export default connect(({ inst: { accList, progress } }) => ({
  accList,
  progress
}))(Dashboard);
