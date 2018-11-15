// @flow

import React, { PureComponent } from "react";
import type {
  UpdatePasswordSectionProps as Props,
  SetPasswordSectionState as State
} from "./types";
import InputField from "components/InputField";
import GradientButton from "components/GradientButton";
import { setPassword, clearMessages } from "ducks/password";
import store from "store";
import { connect } from "react-redux";

class SetPasswordSection extends PureComponent<Props, State> {
  state = {
    password: "",
    passwordConfirm: ""
  };

  handleInputChange = (inputName: string) => (value: string) =>
    this.setState({ [inputName]: value });

  render() {
    const { passwordError, successMessage } = this.props;

    let statusMessage = <span className="message" />;

    if (passwordError) {
      statusMessage = (
        <span className="message message_error">{passwordError}</span>
      );
    } else if (successMessage) {
      statusMessage = (
        <span className="message message_success">{successMessage}</span>
      );
    }

    return (
      <div className="row settings__item">
        <div className="col-lg-5 col-md-12 settings__item-descr">
          <h3>Set password</h3>
          {statusMessage}
        </div>
        <div className="col-lg-7 col-md-12 settings__item-content">
          <InputField
            inputName="Password"
            inputValue={this.state.password}
            handleChange={this.handleInputChange("password")}
            style="light"
            type="password"
          />
          <InputField
            inputName="Confirm password"
            inputValue={this.state.passwordConfirm}
            handleChange={this.handleInputChange("passwordConfirm")}
            style="light"
            type="password"
          />
          <GradientButton
            handleClick={() => store.dispatch(setPassword(this.state))}
            value={"Confirm"}
          />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  passwordError: state.password.error,
  successMessage: state.password.successMessage
}))(SetPasswordSection);
