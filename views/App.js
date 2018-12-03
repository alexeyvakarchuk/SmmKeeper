import React, { Component } from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import configureStore from "store";
// import BaseRoutes from "routes/Base/client";

import BaseApp from "./BaseApp";

// the initial state configured on the server is sent through
// the `window` object before the bundle to make sure it doesn't get blocked
const initialState = window.INITIAL_STATE || {};
// once this gets loaded in, garbage collect the old `window` state
delete window.INITIAL_STATE;

const { history, store } = configureStore(initialState);

// console.log(initialState, history);
// console.log(store);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <BaseApp store={store} />
        </ConnectedRouter>
      </Provider>
    );
  }
}
