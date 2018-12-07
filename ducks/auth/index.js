// @flow

import { all, take, takeEvery, put, call, select } from "redux-saga/effects";
import { baseURL } from "config";
import axios from "axios";
import { createAction, handleActions, combineActions } from "redux-actions";
import {
  SIGN_IN_REQUEST,
  SIGN_IN_START,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAIL,
  SIGN_UP_REQUEST,
  SIGN_UP_START,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAIL,
  SIGN_OUT_REQUEST,
  SIGN_OUT_START,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAIL,
  CLEAR_AUTH_ERROR,
  GOOGLE_SIGN_IN_REQUEST,
  GOOGLE_SIGN_IN_START,
  GOOGLE_SIGN_IN_SUCCESS,
  GOOGLE_SIGN_IN_FAIL
} from "./const";
import { SOCKET_CONN_END } from "ducks/socket/const";
import type { State, UserReq } from "./types";
import redirect from "server/redirect";
import { setCookie, removeCookie } from "server/libs/cookies";
const live = typeof window !== "undefined" && require("ducks/socket").live;
import { eventChannel, END } from "redux-saga";

/**
 * Constants
 * */

export const moduleName: string = "auth";

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
    [combineActions(SIGN_IN_FAIL, SIGN_UP_FAIL, SIGN_OUT_FAIL)]: (
      state: State,
      action
    ) => ({
      ...state,
      progress: false,
      error: action.payload.error
    }),

    [SIGN_OUT_SUCCESS]: () => initialState,
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

    setCookie("tktoken", token);

    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit("signIn", user);
    }

    // yield put(push("/app"));Route
    redirect("/app");
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
    setCookie("tktoken", token);

    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit("signIn", user);
    }

    // yield put(push("/app"));

    redirect("/app");
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
    setCookie("tktoken", token);

    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit("signIn", user);
    }
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
  typeof window !== "undefined" &&
  eventChannel(emitter => {
    // $FlowFixMe
    live.on("signIn", user => {
      emitter({
        type: SIGN_IN_SUCCESS,
        payload: {
          user
        }
      });

      // emitter(push("/app"));

      redirect("/app");
    });

    return () => {
      // $FlowFixMe
      live.off("signIn");
    };
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

    removeCookie("tktoken");

    redirect("/");

    yield put({ type: SIGN_OUT_SUCCESS });

    yield put({ type: SOCKET_CONN_END });

    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit("SIGN_OUT_SUCCESS", { type: SIGN_OUT_SUCCESS });
      // $FlowFixMe
      live.emit("SOCKET_CONN_END", { type: SOCKET_CONN_END });
      // $FlowFixMe
      live.emit("signOut", null, true);
    }
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
  if (typeof window !== "undefined") {
    yield all([listenSignInSaga()]);
  }
}
