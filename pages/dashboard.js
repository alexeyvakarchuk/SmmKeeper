// @flow

import React, { Component } from "react";
import TopBar from "components/TopBar";
import Layout from "hoc/layout";
import LeftBar from "components/LeftBar";
import { socketConnect } from "ducks/socket";
import { fetchAccs, fetchTasks, redirectIfInvalidUsername } from "ducks/inst";
import { checkPasswordExistence } from "ducks/password";
import Dashboard from "sections/Dashboard";
import { fetchUserAuth } from "utils";
import redirect from "server/redirect";
import ConnectAccPopup from "components/ConnectAccPopup";
import { connect } from "react-redux";
import { getCookie } from "server/libs/cookies";

type Props = {|
  username: string,

  socketConnect: () => void
|};

type State = {};

class Internal extends Component<Props, State> {
  static async getInitialProps(ctx) {
    const { store, req, isServer, query } = ctx;

    const storeState = store.getState();

    const {
      inst: { accList, taskList },
      password: { passwordExists }
    } = storeState;

    // console.log(accList, taskList, passwordExists);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("tktoken")
        : getCookie("tktoken", req);

    if (isServer) {
      const auth = await fetchUserAuth(store, token);

      if (auth) {
        await store.execSagaTasks(isServer, dispatch => {
          dispatch(fetchAccs({ token, queryUsername: query.username, ctx }));
        });

        await store.execSagaTasks(isServer, dispatch => {
          dispatch(fetchTasks({ username: query.username, token }));
          dispatch(checkPasswordExistence({ token }));
        });
      } else {
        redirect("/signIn", ctx);
      }
    } else {
      if (storeState.auth.user) {
        if (!accList || passwordExists === null) {
          store.dispatch(fetchAccs({ token, queryUsername: query.username }));

          // store.dispatch(fetchTasks({ username: query.username, token }));

          store.dispatch(checkPasswordExistence({ token }));
        } else {
          redirectIfInvalidUsername(accList, query.username);
        }
      } else {
        const auth = await fetchUserAuth(store, token);

        if (auth) {
          store.dispatch(fetchAccs({ token, queryUsername: query.username }));

          // store.dispatch(fetchTasks({ username: query.username, token }));

          store.dispatch(checkPasswordExistence({ token }));
        } else {
          redirect("/signIn");
        }
      }
    }

    return { username: query.username };
  }

  componentDidMount() {
    this.props.socketConnect();
  }

  render() {
    return (
      <Layout title="Dashboard">
        <section className="internal">
          <TopBar />
          <LeftBar />

          <div className="main">
            <Dashboard username={this.props.username} />
          </div>

          <ConnectAccPopup />
        </section>
      </Layout>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    socketConnect: () => dispatch(socketConnect())
  })
)(Internal);
