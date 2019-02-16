// @flow

import React, { PureComponent } from "react";
import Select from "components/Select";
import type { OptionType } from "react-select/src/types";

type Props = {
  instanceId: string,
  placeholder: string,
  options: OptionType[]
};

type State = { value: OptionType | null };

class WrappedSelect extends PureComponent<Props, State> {
  state = { value: null };

  handleChange = (value: OptionType | null) => this.setState({ value });

  render() {
    const { instanceId, placeholder, options } = this.props;

    return (
      <Select
        instanceId={instanceId}
        placeholder={placeholder}
        value={this.state.value}
        onChange={this.handleChange}
        options={options}
        {...this.props}
      />
    );
  }
}

export default WrappedSelect;
