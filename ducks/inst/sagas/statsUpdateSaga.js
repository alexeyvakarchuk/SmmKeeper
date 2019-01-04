// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  STATS_UPDATE_START,
  STATS_UPDATE_SUCCESS,
  STATS_UPDATE_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

// *** Updates stats every time when user checks profile page to always show him relevant data.
// *** By default stats updates on server automatically at 11pm every day

/* eslint-disable consistent-return */
export default function* statsUpdateSaga({
  payload: { username, token }
}: {
  payload: {
    username: string,
    token: string
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressStatsUpdate) return true;

  yield put({ type: STATS_UPDATE_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const statsUpdateRef = {
        method: "post",
        url: "/api/inst/update-stats",
        baseURL,
        data: {
          id: user.id,
          token,
          username
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { acc }
      } = yield call(axios, statsUpdateRef);

      yield put({
        type: STATS_UPDATE_SUCCESS,
        payload: { acc, username }
      });
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: STATS_UPDATE_FAIL,
      payload: {
        error: err
      }
    });
  }
}
