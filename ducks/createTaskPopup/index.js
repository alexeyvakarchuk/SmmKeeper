// @flow

import { createAction, handleActions, combineActions } from "redux-actions";
import { takeLatest, fork, put, call, select } from "redux-saga/effects";
import axios from "axios";
import { baseURL } from "config";

import {
  POPUP_OPEN,
  POPUP_CLOSE,
  SEARCH_USERS_REQUEST,
  SEARCH_USERS_START,
  SEARCH_USERS_SUCCESS,
  CLEAR_SEARCH_RESULTS
} from "ducks/createTaskPopup/const";
import { SIGN_OUT_SUCCESS } from "ducks/auth/const";
import { SOCKET_CHECKPOINT_REQUIRED } from "ducks/socket/const";

import { stateSelector as authStateSelector } from "ducks/auth";

import type { State } from "./types";

/**
 * Constants
 * */

export const moduleName: string = "createTaskPopup";

/**
 * Reducer
 * */

export const initialState: State = {
  visible: false,
  searchResults: [],
  searchProgress: false
};

const createTaskPopupReducer = handleActions(
  {
    [POPUP_OPEN]: state => ({
      ...state,
      visible: true
    }),
    [POPUP_CLOSE]: state => ({
      ...state,
      visible: false
    }),

    [SEARCH_USERS_START]: state => ({
      ...state,
      searchProgress: true
    }),

    [SEARCH_USERS_SUCCESS]: (state, action) => ({
      ...state,
      searchProgress: false,
      searchResults: action.payload.searchResults
    }),

    [CLEAR_SEARCH_RESULTS]: state => ({
      ...state,
      searchResults: []
    }),

    [SIGN_OUT_SUCCESS]: () => initialState
  },
  initialState
);

export default createTaskPopupReducer;

/**
 * Selectors
 * */
export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const openPopup = createAction(POPUP_OPEN);
export const closePopup = createAction(POPUP_CLOSE);
export const searchUsers = createAction(SEARCH_USERS_REQUEST);
export const clearSearchResults = createAction(CLEAR_SEARCH_RESULTS);

/**
 * Sagas
 * */

export function* searchUsersSaga({
  payload: { username, searchPhase }
}: {
  payload: { username: string, searchPhase: string }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  yield put({ type: SEARCH_USERS_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const searchUsersRef = {
        method: "post",
        url: "/api/inst/search-users",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          username,
          searchPhase
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { searchResults }
      } = yield call(axios, searchUsersRef);

      yield put({
        type: SEARCH_USERS_SUCCESS,
        payload: { searchResults }
      });
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    console.log(err);
    // yield put({
    //   type: FETCH_ACCS_FAIL,
    //   payload: {
    //     error: err
    //   }
    // });
  }
}

export function* watchCreateTaskPopup(): mixed {
  const action = yield takeLatest(SEARCH_USERS_REQUEST, searchUsersSaga);
}
