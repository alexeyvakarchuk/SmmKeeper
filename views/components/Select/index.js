// @flow

import React, { Component } from "react";
import Select, { components } from "react-select";
import SelectCaret from "icons/SelectCaret";
import type { Props, State } from "./types";

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <SelectCaret />
      </components.DropdownIndicator>
    )
  );
};

export default class SelectComponent extends Component<Props, State> {
  state = {
    menuIsOpen: false
  };

  render() {
    return (
      <Select
        components={{ DropdownIndicator }}
        className={`select ${this.state.menuIsOpen ? "select_active" : ""}`}
        classNamePrefix="select"
        menuIsOpen={this.state.menuIsOpen}
        onMenuOpen={() => this.setState({ menuIsOpen: true })}
        onMenuClose={() => this.setState({ menuIsOpen: false })}
        {...this.props}
      />
    );
  }
}
