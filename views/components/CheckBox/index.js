// @flow

import React, { PureComponent } from "react";
import classnames from "classnames";
import ThreeDots from "icons/ThreeDots";
import Check from "icons/Check";
import type { Props, State } from "./types";

export default class Button extends PureComponent<Props, State> {
  handleClick = () => {
    if (this.props.checked) {
      this.props.handleChange(false);
    } else {
      this.props.handleChange(true);
    }
  };

  render() {
    const { checked, label, handleChange, progress } = this.props;

    const checkBoxClassName = classnames("checkbox", {
      ["checkbox_checked"]: checked === true
    });

    return (
      <div className={checkBoxClassName}>
        <div className="checkbox__check" onClick={this.handleClick}>
          {checked && <Check />}
        </div>
        {label && (
          <span className="checkbox__label" onClick={this.handleClick}>
            {label}
          </span>
        )}
      </div>
    );
  }
}
