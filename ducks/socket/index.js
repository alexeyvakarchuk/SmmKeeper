// @flow

import { takeEvery, take, put, call, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import tabex from "tabex";
import { createAction, handleActions } from "redux-actions";
import {
  SIGN_OUT_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_OUT_SUCCESS,
  signOut
} from "ducks/auth";
import {
  TODO_ADD_SUCCESS,
  TODO_COMPLETE_SUCCESS,
  TODO_INCOMPLETE_SUCCESS
} from "ducks/todolist";
import {
  UPDATE_PASSWORD_SOCKET_EVENT,
  SET_PASSWORD_SUCCESS
} from "ducks/password";
import { push } from "react-router-redux";
import io from "socket.io-client";
import type { State } from "./types";
import { baseURL } from "config";

/**
 * Constants
 * */

export const moduleName: string = "socket";

export const SOCKET_CONN_REQUEST: "SOCKET/SOCKET_CONN_REQUEST" =
  "SOCKET/SOCKET_CONN_REQUEST";
export const SOCKET_CONN_START: "SOCKET/SOCKET_CONN_START" =
  "SOCKET/SOCKET_CONN_START";
export const SOCKET_CONN_SUCCESS: "SOCKET/SOCKET_CONN_SUCCESS" =
  "SOCKET/SOCKET_CONN_SUCCESS";
export const SOCKET_CONN_END: "SOCKET/SOCKET_CONN_END" =
  "SOCKET/SOCKET_CONN_END";
export const SOCKET_CONN_FAIL: "SOCKET/SOCKET_CONN_FAIL" =
  "SOCKET/SOCKET_CONN_FAIL";

export const SOCKET_AUTH_SUCCESS: "SOCKET/SOCKET_AUTH_SUCCESS" =
  "SOCKET/SOCKET_AUTH_SUCCESS";

/**
 * Reducer
 * */

export const initialState: State = {
  progress: false,
  connected: false,
  auth: false,
  error: null
};

const socketReducer = handleActions(
  {
    [SOCKET_CONN_START]: (state: State) => ({
      progress: true,
      connected: false,
      auth: false,
      error: null
    }),
    [SOCKET_CONN_SUCCESS]: (state: State) => ({
      progress: false,
      connected: true,
      auth: false,
      error: null
    }),
    [SOCKET_AUTH_SUCCESS]: (state: State) => ({
      progress: false,
      connected: true,
      auth: true,
      error: null
    }),
    [SOCKET_CONN_END]: () => initialState,
    [SOCKET_CONN_FAIL]: (state: State, action) => ({
      progress: false,
      connected: false,
      auth: false,
      error: action.payload.error
    })
  },
  initialState
);

export default socketReducer;

/**
 * Selectors
 * */
export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */
export const socketConnect = createAction(SOCKET_CONN_REQUEST);

/**
 * Sagas
 * */

export const live = tabex.client();

const initWebsocket = () =>
  eventChannel(emitter => {
    const socket = io(baseURL, { reconnection: false, forceNew: true });

    const triggerDispatch = data => emitter(data);

    socket.on("error", err => {
      console.log(err);
    });

    socket.on("connect", () => emitter({ type: SOCKET_CONN_SUCCESS }));

    live.on("SIGN_OUT_SUCCESS", triggerDispatch);
    live.on("SOCKET_CONN_END", triggerDispatch);
    live.on("UPDATE_PASSWORD_START", triggerDispatch);
    live.on("UPDATE_PASSWORD_SUCCESS", triggerDispatch);
    live.on("UPDATE_PASSWORD_FAIL", triggerDispatch);

    live.on("signOut", () => {
      socket.disconnect();

      emitter(push("/"));
    });

    const token = localStorage.getItem("tktoken");

    socket.emit("authenticate", { token }); //send the jwt

    socket.on("authenticated", () => {
      emitter({ type: SOCKET_AUTH_SUCCESS });
    });

    socket.on("newToDo", todo => {
      emitter({
        type: TODO_ADD_SUCCESS,
        payload: {
          todo
        }
      });
    });

    socket.on("completeToDo", id => {
      emitter({
        type: TODO_COMPLETE_SUCCESS,
        payload: {
          _id: id
        }
      });
    });

    socket.on("incompleteToDo", id => {
      // console.log(data);
      // socket.emit("clientEvent", "This is from client!!!");
      emitter({
        type: TODO_INCOMPLETE_SUCCESS,
        payload: {
          _id: id
        }
      });
    });

    socket.on("signOut", () => {
      emitter({
        type: UPDATE_PASSWORD_SOCKET_EVENT,
        payload: {
          socket
        }
      });
    });

    socket.on("setPassword", token => {
      if (localStorage.getItem("tktoken") !== token) {
        localStorage.setItem("tktoken", token);
      }

      emitter({ type: SET_PASSWORD_SUCCESS });
    });

    // socket.on("toAllRoom", () => {
    //   console.log("message to all room of users!");
    // });

    socket.on("unauthorized", (error, cb) => {
      if (
        error.data.type == "UnauthorizedError" ||
        error.data.code == "invalid_token"
      ) {
        console.log("User unautorised");
        emitter({ type: SIGN_OUT_REQUEST });
      }
    });

    return () => {
      console.log("Socket closed");
      socket.close();
    };
  });

// Opens Websocket when user clicks on the sign in button and waits till the result of signing in
export function* socketConnectSaga(): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SOCKET_CONN_START });

  try {
    const channel = yield call(initWebsocket);

    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } catch (err) {
    yield put({
      type: SOCKET_CONN_FAIL,
      payload: {
        error: err
      }
    });
  }
}

export function* watchSocket(): mixed {
  yield takeEvery(SOCKET_CONN_REQUEST, socketConnectSaga);
}
