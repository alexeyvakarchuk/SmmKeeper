// @flow

import React, { Component } from "react";
import TopBar from "components/TopBar";
import Layout from "hoc/layout";
import { fetchUserAuth } from "utils";
import redirect from "server/redirect";
import { getCookie } from "server/libs/cookies";

// import { redirectIfAuthentificated } from "utils";

export default class SignInPage extends Component<{}, {}> {
  static async getInitialProps(ctx: Object) {
    const { store, req, isServer } = ctx;

    const { user } = store.getState().auth;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("tktoken")
        : getCookie("tktoken", req);

    if (isServer) {
      const auth = await fetchUserAuth(store, token);

      if (auth) {
        // User value after fetching auth
        const { user } = store.getState().auth;

        if (user.isAdmin !== true) {
          redirect("/app", ctx);
        }
      } else {
        redirect("/signIn", ctx);
      }
    } else {
      if (user) {
        if (user.isAdmin !== true) {
          redirect(`/app`);
        }
      } else {
        const auth = await fetchUserAuth(store, token);

        if (auth) {
          // User value after fetching auth
          const { user } = store.getState().auth;

          if (user.isAdmin !== true) {
            redirect(`/app`);
          }
        } else {
          redirect("/signIn");
        }
      }
    }

    return {};
  }
  render() {
    return (
      <Layout title="admin">
        <section className="internal">
          <TopBar />

          <div className="main">Admin Panel</div>
        </section>
      </Layout>
    );
  }
}
