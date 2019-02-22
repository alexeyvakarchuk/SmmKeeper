// @flow

import React, { PureComponent } from "react";
import CheckBox from "components/CheckBox";

type Props = {
  label?: string
};

type State = { checked: boolean };

class WrappedCheckBox extends PureComponent<Props, State> {
  state = { checked: false };

  handleChange = (checked: boolean) => this.setState({ checked });

  render() {
    return (
      <CheckBox
        checked={this.state.checked}
        handleChange={this.handleChange}
        {...this.props}
      />
    );
  }
}

export default WrappedCheckBox;
