// @flow

import React, { PureComponent } from "react";

class AuthSuccess extends PureComponent<{}, {}> {
  componentDidMount() {
    const url = "/app";
    window.opener.open(url, "_self");
    window.opener.focus();
    window.close();
  }

  render() {
    return <div />;
  }
}

export default AuthSuccess;
