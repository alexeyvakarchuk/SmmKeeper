// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  FETCH_ACCS_START,
  FETCH_ACCS_SUCCESS,
  FETCH_ACCS_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

import { redirectIfInvalidUsername } from "ducks/inst/utils";

// *** Fetches all insta profiles connected to service account

export default function* fetchAccsSaga({
  payload: { token, queryUsername, ctx }
}: {
  payload: { token: string, queryUsername: string, ctx?: Object }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressFetchAccs) return true;

  yield put({ type: FETCH_ACCS_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const fetchAccListRef = {
        method: "post",
        url: "/api/inst/fetch",
        baseURL,
        data: {
          id: user.id,
          token: token
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { accList }
      } = yield call(axios, fetchAccListRef);

      yield put({
        type: FETCH_ACCS_SUCCESS,
        payload: { accList }
      });

      redirectIfInvalidUsername(accList, queryUsername, ctx);
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: FETCH_ACCS_FAIL,
      payload: {
        error: err
      }
    });
  }
}
