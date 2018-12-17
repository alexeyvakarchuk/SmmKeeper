// @flow

import { baseURL } from "config";
import axios from "axios";
import { takeEvery, take, put, call, select } from "redux-saga/effects";
import { stateSelector as authStateSelector } from "ducks/auth";
import { createAction, handleActions, combineActions } from "redux-actions";
import type { State } from "./types";
import type {
  UpdatePasswordSectionState as UpdatePasswordReq,
  SetPasswordSectionState as SetPasswordReq
} from "pages/Settings/types";
import {
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_START,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_SUCCESS_MESSAGE,
  SET_PASSWORD_SOCKET_EVENT,
  SET_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
  UPDATE_PASSWORD_SOCKET_EVENT,
  UPDATE_PASSWORD_FAIL,
  CLEAR_MESSAGES,
  CHECK_PASSWORD_EXISTENCE_REQUEST,
  CHECK_PASSWORD_EXISTENCE_START,
  CHECK_PASSWORD_EXISTENCE_YES,
  CHECK_PASSWORD_EXISTENCE_NO,
  CHECK_PASSWORD_EXISTENCE_FAIL
} from "./const";
import { SIGN_OUT_SUCCESS } from "ducks/auth/const";
import redirect from "server/redirect";
import { setCookie } from "server/libs/cookies";
const live = typeof window !== "undefined" && require("ducks/socket").live;

/**
 * Constants
 * */

export const moduleName: string = "password";

/**
 * Reducer
 * */

export const initialState: State = {
  passwordExists: null,
  updated: false,
  progress: false,
  successMessage: null,
  error: null
};

const passwordReducer = handleActions(
  {
    [combineActions(SET_PASSWORD_START, UPDATE_PASSWORD_START)]: (
      state: State
    ) => ({
      ...state,
      updated: false,
      progress: true,
      successMessage: null,
      error: null
    }),
    [SET_PASSWORD_SUCCESS]: (state: State, action) => ({
      ...state,
      passwordExists: true,
      updated: true,
      progress: false,
      error: null
    }),
    [UPDATE_PASSWORD_SUCCESS]: (state: State) => ({
      ...state,
      updated: true,
      progress: false,
      error: null
    }),
    [combineActions(
      SET_PASSWORD_SUCCESS_MESSAGE,
      UPDATE_PASSWORD_SUCCESS_MESSAGE
    )]: (state: State, action) => ({
      ...state,
      successMessage: action.payload.message
    }),
    [combineActions(SET_PASSWORD_FAIL, UPDATE_PASSWORD_FAIL)]: (
      state: State,
      action
    ) => ({
      ...state,
      successMessage: null,
      updated: false,
      progress: false,
      error: action.payload.error
    }),
    [CLEAR_MESSAGES]: (state: State, action) => ({
      ...state,
      successMessage: null,
      error: null
    }),
    [CHECK_PASSWORD_EXISTENCE_START]: (state: State, action) => ({
      ...state,
      progress: true
    }),
    [CHECK_PASSWORD_EXISTENCE_YES]: (state: State, action) => ({
      ...state,
      progress: false,
      passwordExists: true
    }),
    [CHECK_PASSWORD_EXISTENCE_NO]: (state: State, action) => ({
      ...state,
      progress: false,
      passwordExists: false
    }),
    [CHECK_PASSWORD_EXISTENCE_FAIL]: (state: State, action) => ({
      ...state,
      progress: false,
      passwordExists: null,
      error: action.payload.error
    }),

    [SIGN_OUT_SUCCESS]: () => initialState
  },
  initialState
);

export default passwordReducer;

/**
 * Selectors
 * */
export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const setPassword = createAction(SET_PASSWORD_REQUEST);
export const updatePassword = createAction(UPDATE_PASSWORD_REQUEST);
export const clearMessages = createAction(CLEAR_MESSAGES);
export const checkPasswordExistence = createAction(
  CHECK_PASSWORD_EXISTENCE_REQUEST
);

/**
 * Sagas
 * */

export function* checkPasswordExistenceSaga({
  payload: { token }
}: {
  payload: {
    token: string
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: CHECK_PASSWORD_EXISTENCE_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const checkPasswordExistenceRef = {
        method: "post",
        url: "/api/check-password-existence",
        baseURL,
        data: {
          id: user.id,
          token
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { passwordExist }
      } = yield call(axios, checkPasswordExistenceRef);

      if (passwordExist) {
        yield put({
          type: CHECK_PASSWORD_EXISTENCE_YES
        });
      } else {
        yield put({
          type: CHECK_PASSWORD_EXISTENCE_NO
        });
      }
    } else {
      yield put({
        type: CHECK_PASSWORD_EXISTENCE_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: CHECK_PASSWORD_EXISTENCE_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}

export function* setPasswordSaga({
  payload: { password, passwordConfirm }
}: {
  payload: SetPasswordReq
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: SET_PASSWORD_START });

  // live.emit("SET_PASSWORD_START", { type: UPDATE_PASSWORD_START });

  try {
    const { user } = yield select(authStateSelector);
    if (user.id) {
      const setPasswordRef = {
        method: "post",
        url: "/api/set-password",
        baseURL,
        data: {
          id: user.id,
          email: user.email,
          token: localStorage.getItem("tktoken"),
          password,
          passwordConfirm
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, setPasswordRef);

      yield put({
        type: SET_PASSWORD_SUCCESS_MESSAGE,
        payload: {
          message: "Password was set succesfully"
        }
      });
    } else {
      yield put({
        type: SET_PASSWORD_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: SET_PASSWORD_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}

export function* updatePasswordSaga({
  payload: { password, newPassword, newPasswordConfirm }
}: {
  payload: UpdatePasswordReq
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: UPDATE_PASSWORD_START });

  if (typeof window !== "undefined") {
    // $FlowFixMe
    live.emit("UPDATE_PASSWORD_START", { type: UPDATE_PASSWORD_START });
  }

  try {
    const { user } = yield select(authStateSelector);
    if (user.id) {
      const updatePasswordRef = {
        method: "post",
        url: "/api/update-password",
        baseURL,
        data: {
          id: user.id,
          email: user.email,
          token: localStorage.getItem("tktoken"),
          password,
          newPassword,
          newPasswordConfirm
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { token }
      } = yield call(axios, updatePasswordRef);

      console.log(token);

      localStorage.setItem("tktoken", token);
      setCookie("tktoken", token);

      yield put({
        type: UPDATE_PASSWORD_SUCCESS_MESSAGE,
        payload: {
          message: "Password was succesfully updated"
        }
      });

      // localStorage.setItem("tktoken", data);
    } else {
      yield put({
        type: UPDATE_PASSWORD_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: UPDATE_PASSWORD_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit("UPDATE_PASSWORD_FAIL", {
        type: UPDATE_PASSWORD_FAIL,
        payload: {
          error: null
        }
      });
    }
  }
}

export function* updatePasswordSocketEventSaga({
  payload: { socket }
}: {
  payload: { socket: Object }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) {
    yield put({
      type: UPDATE_PASSWORD_SUCCESS
    });

    if (typeof window !== "undefined") {
      // $FlowFixMe
      live.emit({
        type: UPDATE_PASSWORD_SUCCESS
      });
    }
  } else {
    socket.disconnect();

    redirect("/");
  }
}

export function* watchPassword(): mixed {
  yield takeEvery(SET_PASSWORD_REQUEST, setPasswordSaga);
  yield takeEvery(UPDATE_PASSWORD_REQUEST, updatePasswordSaga);
  yield takeEvery(UPDATE_PASSWORD_SOCKET_EVENT, updatePasswordSocketEventSaga);
  yield takeEvery(CHECK_PASSWORD_EXISTENCE_REQUEST, checkPasswordExistenceSaga);
}
