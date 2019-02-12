// @flow

import * as React from "react";

export type Props = {
  inputName: string,
  inputValue: string,
  handleChange(string): void,
  type?: string,
  style?: "dark" | "light",
  icon?: React.Node,
  autocomplete?: "on" | "off"
};
