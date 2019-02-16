// @flow

import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Select from "components/Select";
import InstaProfileSelect from "components/InstaProfileSelect";
import Button from "components/Button";
import type { Props, State } from "./types";
import { createTask } from "ducks/inst";
import { closePopup, clearSearchResults } from "ducks/createTaskPopup";
import type { OptionType } from "react-select/src/types";

class CreateTaskPopup extends PureComponent<Props, State> {
  state = {
    actionType: null,
    actionSource: null
  };

  handleInputChange = (inputName: string) => (value: OptionType | null) =>
    this.setState({ [inputName]: value });

  handleSubmit = () => {
    const { actionSource, actionType } = this.state;

    this.props.createTask({
      username: this.props.username,
      type: actionType !== null && actionType.value ? actionType.value : null,
      sourceUsername:
        actionSource !== null && actionSource.value ? actionSource.value : ""
    });
  };

  render() {
    const {
      progressCreateTask,
      searchProgress,
      searchResults,
      clearSearchResults
    } = this.props;

    const taskTypes = [
      { value: "mf", label: "Following" },
      { value: "uf", label: "Unfollowing" },
      { value: "ml", label: "Liking" }
    ];

    return (
      this.props.popupVisible &&
      ReactDOM.createPortal(
        <div
          className="popup popup_create-task"
          onClick={this.props.closePopup}
        >
          <div
            className={`popup__content ${
              progressCreateTask ? "popup__content_loading" : ""
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="popup__close" onClick={this.props.closePopup} />

            <div className="popup__container">
              <h3>Add new task</h3>

              <span className="popup__error-text">{this.props.error}</span>

              <Select
                instanceId="new-task-type"
                placeholder="Choose task type"
                value={this.state.actionType}
                onChange={this.handleInputChange("actionType")}
                options={taskTypes}
              />

              <InstaProfileSelect
                instanceId="user-search"
                placeholder="Source account username"
                value={this.state.actionSource}
                handleChange={this.handleInputChange("actionSource")}
                username={this.props.username}
                searchProgress={searchProgress}
                searchResults={searchResults}
                clearSearchResults={clearSearchResults}
              />

              <Button
                className="popup__submit-button"
                handleClick={this.handleSubmit}
                value="Add task"
                disabled={
                  this.state.actionType === null ||
                  this.state.actionSource === null
                }
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
    createTaskPopup: { visible, searchProgress, searchResults }
  }) => ({
    accList,
    progressCreateTask,
    error,
    popupVisible: visible,
    searchProgress,
    searchResults
  }),
  dispatch => ({
    createTask: task => dispatch(createTask(task)),
    closePopup: () => dispatch(closePopup()),
    clearSearchResults: () => dispatch(clearSearchResults())
  })
)(CreateTaskPopup);
