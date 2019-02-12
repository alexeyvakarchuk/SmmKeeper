// @flow

import React, { Component } from "react";
import classnames from "classnames";
import type { Props } from "./types";

class InputField extends Component<Props, {}> {
  static defaultProps = {
    type: "text",
    style: "light",
    autocomplete: "new-password"
  };

  render() {
    const {
      inputName,
      inputValue,
      handleChange,
      type,
      style,
      icon,
      autocomplete
    } = this.props;

    const inputFieldClassName = classnames("input-field", {
      ["input-field_with-icon"]: icon
    });

    const iconClassName = classnames("input-field__icon", {
      ["input-field__icon_active"]: inputValue.length > 0
    });

    return (
      <div className={inputFieldClassName}>
        {icon && <span className={iconClassName}>{icon}</span>}
        <input
          className="input-field__input"
          type={type}
          onChange={e => handleChange(e.target.value)}
          value={inputValue}
          placeholder={inputName}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete={this.props.autocomplete}
        />
      </div>
    );
  }
}

export default InputField;
