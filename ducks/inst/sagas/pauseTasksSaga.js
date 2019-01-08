// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  TASKS_PAUSE_START,
  TASKS_PAUSE_SUCCESS,
  TASKS_PAUSE_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

// *** Pauses all tasks connected to insta profile

/* eslint-disable consistent-return */
export default function* pauseTasksSaga({
  payload: { username, tasks }
}: {
  payload: {
    username: string,
    tasks: string[]
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.porgressTasksUpdate) return true;

  yield put({ type: TASKS_PAUSE_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const pauseTasksRef = {
        method: "post",
        url: "/api/inst/tasks-pause",
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
      type: TASKS_PAUSE_FAIL,
      payload: {
        error: err
      }
    });
  }
}
