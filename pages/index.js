// @flow

import React, { Component } from "react";
import Layout from "hoc/layout";
import { Link } from "server/routes";
import { redirectIfAuthentificated } from "utils";

export default class HomePage extends Component<{}, {}> {
  static async getInitialProps(ctx: Object) {
    await redirectIfAuthentificated(ctx);

    return {};
  }

  render() {
    return (
      <Layout>
        <section className="home">
          <h1>SmmKeeper</h1>
          <div>
            <Link prefetch route="/signIn">
              <a>Sign in</a>
            </Link>
            <Link prefetch route="/signUp">
              <a>Sign up</a>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }
}
