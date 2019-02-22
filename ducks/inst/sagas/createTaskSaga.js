// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  TASK_CREATE_START,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_FAIL
} from "ducks/inst/const";
import { POPUP_CLOSE } from "ducks/createTaskPopup/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

import type { TaskType, TaskFilters } from "ducks/inst/types";

// *** Creates new task and starts it's execution

/* eslint-disable consistent-return */
export default function* createTaskSaga({
  payload: { username, type, sourceUsername, filters }
}: {
  payload: {
    username: string,
    type: TaskType,
    sourceUsername: string,
    filters: TaskFilters
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressCreateTask) return true;

  yield put({ type: TASK_CREATE_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const connAccRef = {
        method: "post",
        url: "/api/inst/task-create",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          username,
          type,
          sourceUsername,
          filters
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, connAccRef);

      yield put({ type: POPUP_CLOSE });
    } else {
      yield put({
        type: TASK_CREATE_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: TASK_CREATE_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}
