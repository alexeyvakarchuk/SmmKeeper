// @flow

import React, { Component } from "react";
import Select, { components } from "react-select";
import { searchUsers } from "ducks/createTaskPopup";
import { connect } from "react-redux";
import type { Props, State } from "./types";

const Option = props => {
  const { innerProps, innerRef } = props;
  const { username, profilePic, followers } = props.data;

  return (
    <div
      className="option"
      onClick={props => props.selectOption(props.data)}
      ref={innerRef}
      {...innerProps}
    >
      <div
        style={{ backgroundImage: `url(${profilePic})` }}
        className="option__image"
      />
      <span className="option__name">{username}</span>
      <span className="option__followers">{followers}</span>
    </div>
  );
};

class InstaProfileSelect extends Component<Props, State> {
  state = {
    menuIsOpen: false
  };

  handleInputChange = value => {
    const { username, searchUsers, clearSearchResults } = this.props;

    if (value !== "") {
      searchUsers(value, username);
    } else {
      clearSearchResults();
    }
  };

  render() {
    const {
      searchProgress,
      searchResults,
      value,
      placeholder,
      handleChange
    } = this.props;

    const options = searchResults.map(el => ({
      ...el,
      value: el.username,
      label: el.username
    }));

    return (
      <Select
        components={{ DropdownIndicator: null, Option }}
        className={`userSelect ${
          this.state.menuIsOpen ? "userSelect_active" : ""
        }`}
        classNamePrefix="userSelect"
        menuIsOpen={this.state.menuIsOpen}
        onMenuOpen={() => this.setState({ menuIsOpen: true })}
        onMenuClose={() => this.setState({ menuIsOpen: false })}
        isLoading={searchProgress}
        onInputChange={this.handleInputChange}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
        maxMenuHeight="120"
        isClearable
      />
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
)(InstaProfileSelect);
