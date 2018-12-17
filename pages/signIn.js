// @flow

import React, { Component } from "react";
import Layout from "hoc/layout";
import Auth from "sections/Auth";
import { redirectIfAuthentificated } from "utils";

export default class SignInPage extends Component<{}, {}> {
  static async getInitialProps(ctx: Object) {
    await redirectIfAuthentificated(ctx);

    return {};
  }

  render() {
    return (
      <Layout title="Log in">
        <Auth formState="SignIn" />
      </Layout>
    );
  }
}
