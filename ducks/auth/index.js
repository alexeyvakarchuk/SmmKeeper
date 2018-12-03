// @flow

import { all, take, takeEvery, put, call, select } from "redux-saga/effects";
import { baseURL } from "config";
import axios from "axios";
import { createAction, handleActions, combineActions } from "redux-actions";
import { SOCKET_CONN_END } from "ducks/socket";
import type { State, UserReq } from "./types";
import { push } from "react-router-redux";
const live = process.env.BROWSER ? require("ducks/socket").live : false;
import { eventChannel, END } from "redux-saga";

/**
 * Constants
 * */

export const moduleName: string = "auth";

export const SIGN_IN_REQUEST: "AUTH/SIGN_IN_REQUEST" = "AUTH/SIGN_IN_REQUEST";
export const SIGN_IN_START: "AUTH/SIGN_IN_START" = "AUTH/SIGN_IN_START";
export const SIGN_IN_SUCCESS: "AUTH/SIGN_IN_SUCCESS" = "AUTH/SIGN_IN_SUCCESS";
export const SIGN_IN_FAIL: "AUTH/SIGN_IN_FAIL" = "AUTH/SIGN_IN_FAIL";

export const SIGN_UP_REQUEST: "AUTH/SIGN_UP_REQUEST" = "AUTH/SIGN_UP_REQUEST";
export const SIGN_UP_START: "AUTH/SIGN_UP_START" = "AUTH/SIGN_UP_START";
export const SIGN_UP_SUCCESS: "AUTH/SIGN_UP_SUCCESS" = "AUTH/SIGN_UP_SUCCESS";
export const SIGN_UP_FAIL: "AUTH/SIGN_UP_FAIL" = "AUTH/SIGN_UP_FAIL";

export const SIGN_OUT_REQUEST: "AUTH/SIGN_OUT_REQUEST" =
  "AUTH/SIGN_OUT_REQUEST";
export const SIGN_OUT_START: "AUTH/SIGN_OUT_START" = "AUTH/SIGN_OUT_START";
export const SIGN_OUT_SUCCESS: "AUTH/SIGN_OUT_SUCCESS" =
  "AUTH/SIGN_OUT_SUCCESS";
export const SIGN_OUT_FAIL: "AUTH/SIGN_OUT_FAIL" = "AUTH/SIGN_OUT_FAIL";

export const CLEAR_AUTH_ERROR: "AUTH/CLEAR_AUTH_ERROR" =
  "AUTH/CLEAR_AUTH_ERROR";

// Socials Auth

export const GOOGLE_SIGN_IN_REQUEST: "AUTH/GOOGLE_SIGN_IN_REQUEST" =
  "AUTH/GOOGLE_SIGN_IN_REQUEST";
export const GOOGLE_SIGN_IN_START: "AUTH/GOOGLE_SIGN_IN_START" =
  "AUTH/GOOGLE_SIGN_IN_START";
export const GOOGLE_SIGN_IN_SUCCESS: "AUTH/GOOGLE_SIGN_IN_SUCCESS" =
  "AUTH/GOOGLE_SIGN_IN_SUCCESS";
export const GOOGLE_SIGN_IN_FAIL: "AUTH/GOOGLE_SIGN_IN_FAIL" =
  "AUTH/GOOGLE_SIGN_IN_FAIL";

/**
 * Reducer
 * */

export const initialState: State = {
  // formState: 'SignIn',
  user: null,
  progress: false,
  error: null
};

const authReducer = handleActions(
  {
    [combineActions(SIGN_IN_START, SIGN_UP_START, SIGN_OUT_START)]: (
      state: State
    ) => ({
      ...state,
      progress: true,
      error: null
    }),
    [combineActions(SIGN_IN_SUCCESS, SIGN_UP_SUCCESS)]: (
      state: State,
      action
    ) => ({
      ...initialState,
      user: {
        id: action.payload.user.id,
        email: action.payload.user.email
      }
    }),
    [SIGN_OUT_SUCCESS]: (state: State) => ({
      user: null,
      progress: false,
      error: null
    }),
    [combineActions(SIGN_IN_FAIL, SIGN_UP_FAIL, SIGN_OUT_FAIL)]: (
      state: State,
      action
    ) => ({
      ...state,
      progress: false,
      error: action.payload.error
    }),
    [CLEAR_AUTH_ERROR]: (state: State, action) => ({
      ...state,
      error: null
    })
  },
  initialState
);

export default authReducer;

/**
 * Selectors
 * */

export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const signIn = createAction(SIGN_IN_REQUEST);
export const signUp = createAction(SIGN_UP_REQUEST);
export const signOut = createAction(SIGN_OUT_REQUEST);
export const clearAuthError = createAction(CLEAR_AUTH_ERROR);
export const signInSuccess = createAction(SIGN_IN_SUCCESS);
export const checkGoogleAuth = createAction(GOOGLE_SIGN_IN_REQUEST);

/**
 * Sagas
 * */

/* eslint-disable consistent-return */
export function* signInSaga({
  payload: { email, password }
}: {
  payload: UserReq
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SIGN_IN_START });

  try {
    const signInRef = {
      method: "post",
      url: "/api/sign-in",
      baseURL,
      data: {
        email,
        password
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    const {
      data: { user, token }
    } = yield call(axios, signInRef);

    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });

    localStorage.setItem("tktoken", token);

    live.emit("signIn", user);

    yield put(push("/app"));
  } catch (res) {
    yield put({
      type: SIGN_IN_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}

function* signUpSaga({ payload: { email, password } }) {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SIGN_UP_START });

  try {
    const signUpRef = {
      method: "post",
      url: "/api/sign-up",
      baseURL,
      data: {
        email,
        password
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    const {
      data: { user, token }
    } = yield call(axios, signUpRef);

    yield put({
      type: SIGN_UP_SUCCESS,
      payload: { user }
    });

    localStorage.setItem("tktoken", token);

    live.emit("signIn", user);

    yield put(push("/app"));
  } catch (res) {
    yield put({
      type: SIGN_UP_FAIL,
      payload: { error: res.response.data.error.message }
    });
  }
}

// Opens Websocket when user clicks on the sign in button and waits till the result of signing in
export function* signInWithGoogleSaga(): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: GOOGLE_SIGN_IN_START });

  try {
    const checkAuthRef = {
      method: "post",
      url: "/api/sign-in/google/check",
      baseURL
    };

    const {
      data: { user, token }
    } = yield call(axios, checkAuthRef);

    yield put({
      type: GOOGLE_SIGN_IN_SUCCESS
    });

    // yield put({
    //   type: SIGN_IN_SUCCESS,
    //   payload: { user }
    // });

    localStorage.setItem("tktoken", token);

    live.emit("signIn", user);
  } catch (err) {
    yield put({
      type: GOOGLE_SIGN_IN_FAIL,
      payload: {
        error: err
      }
    });
  }
}

const listenSignIn = () =>
  eventChannel(emitter => {
    if (live && process.env.BROWSER) {
      live.on("signIn", user => {
        emitter({
          type: SIGN_IN_SUCCESS,
          payload: {
            user
          }
        });

        emitter(push("/app"));
      });

      return () => {
        live.off("signIn");
      };
    } else {
      return () => {};
    }
  });

function* listenSignInSaga() {
  const channel = yield call(listenSignIn);

  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

function* signOutSaga() {
  const state = yield select(stateSelector);

  if (state.progress || state.error) return true;

  yield put({ type: SIGN_OUT_START });

  try {
    localStorage.removeItem("tktoken");

    yield put({ type: SIGN_OUT_SUCCESS });

    yield put({ type: SOCKET_CONN_END });

    live.emit("SIGN_OUT_SUCCESS", { type: SIGN_OUT_SUCCESS });
    live.emit("SOCKET_CONN_END", { type: SOCKET_CONN_END });

    live.emit("signOut", null, true);
  } catch (error) {
    yield put({
      type: SIGN_OUT_FAIL,
      payload: { error }
    });
  }
}

export function* watchAuth(): mixed {
  yield takeEvery(SIGN_IN_REQUEST, signInSaga);
  yield takeEvery(SIGN_UP_REQUEST, signUpSaga);
  yield takeEvery(SIGN_OUT_REQUEST, signOutSaga);
  yield takeEvery(GOOGLE_SIGN_IN_REQUEST, signInWithGoogleSaga);
  yield all([listenSignInSaga()]);
}
