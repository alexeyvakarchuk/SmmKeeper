// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  TASKS_START_START,
  TASKS_START_SUCCESS,
  TASKS_START_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

// *** Pauses all tasks connected to insta profile

/* eslint-disable consistent-return */
export default function* startTasksSaga({
  payload: { username, tasks }
}: {
  payload: {
    username: string,
    tasks: string[]
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.porgressTasksUpdate) return true;

  yield put({ type: TASKS_START_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const pauseTasksRef = {
        method: "post",
        url: "/api/inst/tasks-start",
        baseURL,
        data: {
          id: user.id,
          username,
          token: localStorage.getItem("tktoken"),
          tasks
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, pauseTasksRef);
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: TASKS_START_FAIL,
      payload: {
        error: err
      }
    });
  }
}
