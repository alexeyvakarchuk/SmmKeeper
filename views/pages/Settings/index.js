// @flow

import React, { PureComponent } from "react";
import UpdatePasswordSection from "./UpdatePasswordSection";
import SetPasswordSection from "./SetPasswordSection";
import type { Props, State } from "./types";
import store from "store";
import { connect } from "react-redux";
import { clearMessages } from "ducks/password";

class Settings extends PureComponent<Props, State> {
  componentWillUnmount() {
    store.dispatch(clearMessages());
  }

  render() {
    const { passwordExists } = this.props;

    return (
      <section className="settings">
        <div className="container">
          {passwordExists === false ? <SetPasswordSection /> : false}

          {passwordExists === true ? <UpdatePasswordSection /> : false}
        </div>
      </section>
    );
  }
}

export default connect(state => ({
  passwordExists: state.password.passwordExists
}))(Settings);
