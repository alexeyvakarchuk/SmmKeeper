// @flow

import React, { Component } from "react";
import Select, { components } from "react-select";
import SelectCaret from "icons/SelectCaret";

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <SelectCaret />
      </components.DropdownIndicator>
    )
  );
};

export default class Dropdown extends Component {
  state = {
    menuIsOpen: false
  };

  render() {
    return (
      <Select
        components={{ DropdownIndicator }}
        className={`task-select ${
          this.state.menuIsOpen ? "task-select__active" : ""
        }`}
        classNamePrefix="task-select"
        menuIsOpen={this.state.menuIsOpen}
        onMenuOpen={() => this.setState({ menuIsOpen: true })}
        onMenuClose={() => this.setState({ menuIsOpen: false })}
        {...this.props}
      />
    );
  }
}
