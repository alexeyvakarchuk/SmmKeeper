// @flow

import React, { PureComponent } from "react";
import classnames from "classnames";
import ThreeDots from "icons/ThreeDots";
import type { Props, State } from "./types";

export default class Button extends PureComponent<Props, State> {
  render() {
    const { className, disabled, value, handleClick, progress } = this.props;

    const buttonClassName = classnames("button", {
      ["button_progress"]: progress,
      ["button_disabled"]: disabled
    });

    return (
      <button
        className={buttonClassName}
        onClick={() => {
          !progress && handleClick ? handleClick() : false;
        }}
      >
        <span>{value}</span>
        {progress && <ThreeDots />}
      </button>
    );
  }
}
