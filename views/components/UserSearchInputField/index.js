// @flow

import React, { Component } from "react";
import InputField from "components/InputField";
import { searchUsers } from "ducks/createTaskPopup";
import { connect } from "react-redux";
import type { Props } from "./types";

class UserSearchInputField extends Component<Props, {}> {
  handleChange = value => {
    const { username, handleChange, searchUsers } = this.props;

    handleChange(value);

    searchUsers(value, username);
  };

  render() {
    const {
      inputValue,
      handleChange,
      searchProgress,
      searchResults
    } = this.props;

    return (
      <div className="user-search">
        <InputField
          inputName="Source acc username"
          inputValue={inputValue}
          handleChange={this.handleChange}
          style="light"
        />

        {searchProgress && "Searching..."}

        {!searchProgress &&
          searchResults.map(({ username }) => <div>{username}</div>)}
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    searchUsers: (searchPhase, username) =>
      dispatch(
        searchUsers({
          searchPhase,
          username
        })
      )
  })
)(UserSearchInputField);
