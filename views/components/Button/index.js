// @flow

import React, { PureComponent } from "react";
import classnames from "classnames";
import type { Props, State } from "./types";

export default class Button extends PureComponent<Props, State> {
  render() {
    const { className, disabled, value, handleClick } = this.props;

    const buttonClassName = classnames("button", {
      ["button_disabled"]: disabled
    });

    return (
      <button className={buttonClassName} onClick={handleClick}>
        {value}
      </button>
    );
  }
}
