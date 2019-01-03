// @flow

import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Tabs from "components/Tabs";
import InputField from "components/InputField";
import GradientButton from "components/GradientButton";
import type { Props, State } from "./types";
import { createTask } from "ducks/inst";
import { closePopup } from "ducks/createTaskPopup";

class CreateTaskPopup extends PureComponent<Props, State> {
  state = {
    actionSource: "",
    actionType: [
      {
        id: 1,
        value: "Following",
        ref: "mf"
      },
      {
        id: 2,
        value: "Liking",
        ref: "ml"
      }
    ],
    activeTab: 1
  };

  handleInputChange = (inputName: string) => (value: string) =>
    this.setState({ [inputName]: value });

  handleSubmit = () => {
    const { actionSource, actionType, activeTab } = this.state;

    const actionActiveType = actionType.find(el => el.id === activeTab);

    this.props.createTask({
      username: this.props.username,
      type:
        actionActiveType && actionActiveType.ref ? actionActiveType.ref : null,
      sourceUsername: this.state.actionSource
    });
  };

  handleChangeTab = activeTab => this.setState({ activeTab });

  render() {
    const { progressCreateTask } = this.props;

    return (
      this.props.popupVisible &&
      ReactDOM.createPortal(
        <div className="popup" onClick={this.props.closePopup}>
          <div
            className={`popup__content ${
              progressCreateTask ? "popup__content_loading" : ""
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="popup__close" onClick={this.props.closePopup} />

            {/* {this.props.checkpointUrl !== null && (
              <InputField
                inputName="securityCode"
                inputValue={this.state.securityCode}
                handleChange={this.handleInputChange("securityCode")}
                style="light"
              />
            )} */}

            <div className="popup__container">
              <h3>Create new task</h3>

              <span className="popup__error-text">{this.props.error}</span>
              <Tabs
                tabs={this.state.actionType}
                activeTab={this.state.activeTab}
                handleChangeTab={this.handleChangeTab}
              />

              <InputField
                inputName="Source account username"
                inputValue={this.state.actionSource}
                handleChange={this.handleInputChange("actionSource")}
                style="light"
              />

              <GradientButton
                className="popup__submit-button"
                handleClick={this.handleSubmit}
                value={"Confirm"}
              />
            </div>
          </div>
        </div>,
        // $FlowFixMe
        document.getElementById("createTaskPopup")
      )
    );
  }
}

export default connect(
  ({
    inst: { accList, progressCreateTask, error },
    createTaskPopup: { visible }
  }) => ({
    accList,
    progressCreateTask,
    error,
    popupVisible: visible
  }),
  dispatch => ({
    createTask: task => dispatch(createTask(task)),
    closePopup: () => dispatch(closePopup())
  })
)(CreateTaskPopup);
