// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  FETCH_TASKS_START,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

// *** Fetches all tasks connected to insta profile

/* eslint-disable consistent-return */
export default function* fetchTasksSaga({
  payload: { username, token }
}: {
  payload: {
    username: string,
    token: string
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressFetchTasks) return true;

  yield put({ type: FETCH_TASKS_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const fetchTasksRef = {
        method: "post",
        url: "/api/inst/fetch-tasks",
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
        data: { tasksList }
      } = yield call(axios, fetchTasksRef);

      yield put({
        type: FETCH_TASKS_SUCCESS,
        payload: { tasksList }
      });
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: FETCH_TASKS_FAIL,
      payload: {
        error: err
      }
    });
  }
}
