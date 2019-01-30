// @flow

import React, { Component } from "react";
import { searchUsers } from "ducks/createTaskPopup";
import { connect } from "react-redux";
import type { Props } from "./types";

class UserSearchInputField extends Component<Props, {}> {
  static defaultProps = {
    type: "text",
    style: "dark"
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { inputValue, handleChange, searchUsers, username } = this.props;
    handleChange(e.target.value);
    console.log(e.target.value);

    searchUsers(e.target.value, username);

    // axios({
    //   method: "post",
    //   url: "/api/inst/find-users",
    //   baseURL,
    //   data: {
    //     id: user.id,
    //     token: localStorage.getItem("tktoken"),
    //     username,
    //     searchPhase: e.target.value
    //   },
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
  };

  render() {
    const { inputName, inputValue, handleChange, type, style } = this.props;

    const className =
      style === "dark"
        ? "input-field__input"
        : "input-field__input input-field__input-light";

    return (
      <div className="input-field">
        {/* <span className="input-field__label">{inputName}</span> */}
        <input
          className={className}
          type={type}
          value={inputValue}
          onChange={this.handleChange}
          placeholder={inputName}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
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
