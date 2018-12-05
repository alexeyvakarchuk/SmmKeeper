// @flow

import React, { PureComponent } from "react";
import type {
  UpdatePasswordSectionProps as Props,
  UpdatePasswordSectionState as State
} from "./types";
import InputField from "components/InputField";
import GradientButton from "components/GradientButton";
import { updatePassword } from "ducks/password";
import { connect } from "react-redux";

class UpdatePasswordSection extends PureComponent<Props, State> {
  state = {
    password: "",
    newPassword: "",
    newPasswordConfirm: ""
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
          <h3>Change password</h3>
          {statusMessage}
        </div>
        <div className="col-lg-7 col-md-12 settings__item-content">
          <InputField
            inputName="Current password"
            inputValue={this.state.password}
            handleChange={this.handleInputChange("password")}
            style="light"
            type="password"
          />
          <InputField
            inputName="New password"
            inputValue={this.state.newPassword}
            handleChange={this.handleInputChange("newPassword")}
            style="light"
            type="password"
          />
          <InputField
            inputName="Confirm new password"
            inputValue={this.state.newPasswordConfirm}
            handleChange={this.handleInputChange("newPasswordConfirm")}
            style="light"
            type="password"
          />
          <GradientButton
            handleClick={() => this.props.updatePassword(this.state)}
            value={"Update password"}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    passwordError: state.password.error,
    successMessage: state.password.successMessage
  }),
  dispatch => ({
    updatePassword: state => dispatch(updatePassword(state))
  })
)(UpdatePasswordSection);
