import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import saga from "./saga";
import reducer from "./reducer";
import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";
import { routerMiddleware } from "react-router-redux";

const configureStore = (initialState = {}, fromServer) => {
  // initialState will always be Object{} on the server...
  // this will pass to the client so that it will be able to
  // initialize with what the server originally rendered

  let history;

  if (fromServer) {
    // since the server has no HTML5 push states,
    // history must be temporarily created in memory
    history = createMemoryHistory();
  } else {
    // on the client, we can go ahead and make a standard
    // `history` state
    history = createBrowserHistory();
  }

  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  ];

  const store =
    process.env.BROWSER && process.env.NODE_ENV === "development"
      ? createStore(
          reducer,
          {},
          compose(
            ...middlewares,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
          )
        )
      : createStore(reducer, {}, compose(...middlewares));

  sagaMiddleware.run(saga);

  return { history, store };
};

export default configureStore;
