// @flow

import React, { Component } from "react";
import Layout from "hoc/layout";
import Auth from "sections/Auth";
import { redirectIfAuthentificated } from "utils";

export default class SignUpPage extends Component<{}, {}> {
  static async getInitialProps(ctx: Object) {
    await redirectIfAuthentificated(ctx);

    return {};
  }

  render() {
    return (
      <Layout title="Create account">
        <Auth formState="SignUp" />
      </Layout>
    );
  }
}
