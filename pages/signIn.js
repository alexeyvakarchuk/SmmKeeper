// @flow

import React, { Component } from "react";
import Auth from "sections/Auth";
import { redirectIfAuthentificated } from "utils";

export default class SignInPage extends Component<{}, {}> {
  static async getInitialProps(ctx: Object) {
    await redirectIfAuthentificated(ctx);

    return {};
  }

  render() {
    return <Auth formState="SignIn" />;
  }
}
