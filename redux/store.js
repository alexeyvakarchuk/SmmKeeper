import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware, { END } from "redux-saga";
import rootSaga from "./saga";
import reducer from "./reducer";

export const sagaMiddleware = createSagaMiddleware();

const middlewares = [applyMiddleware(sagaMiddleware)];

export const initStore = (initialState = {}) => {
  const store =
    typeof window !== "undefined" && process.env.NODE_ENV === "development"
      ? createStore(
          reducer,
          initialState,
          compose(
            ...middlewares,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
          )
        )
      : createStore(reducer, initialState, compose(...middlewares));

  store.runSaga = () => {
    // Avoid running twice
    if (store.saga) return;
    store.saga = sagaMiddleware.run(rootSaga);
  };

  store.stopSaga = async () => {
    // Avoid running twice
    if (!store.saga) return;
    store.dispatch(END);
    await store.saga.done;
    store.saga = null;
  };

  store.execSagaTasks = async (isServer, tasks) => {
    // run saga
    store.runSaga();
    // dispatch saga tasks
    tasks(store.dispatch);
    // Stop running and wait for the tasks to be done
    await store.stopSaga();
    // Re-run on client side
    if (!isServer) {
      store.runSaga();
    }
  };

  // Initial run
  store.runSaga();

  return store;
};
