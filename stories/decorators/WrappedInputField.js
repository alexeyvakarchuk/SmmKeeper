// @flow

import React, { PureComponent } from "react";
import InputField from "components/InputField";

type Props = {
  inputName: string,
  inputValue?: string
};

type State = { inputValue: string };

class WrappedInputField extends PureComponent<Props, State> {
  state = { inputValue: "" };

  handleChange = (inputValue: string) => this.setState({ inputValue });

  render() {
    return (
      <InputField
        inputName={this.props.inputName}
        inputValue={this.state.inputValue}
        handleChange={this.handleChange}
        {...this.props}
      />
    );
  }
}

export default WrappedInputField;
