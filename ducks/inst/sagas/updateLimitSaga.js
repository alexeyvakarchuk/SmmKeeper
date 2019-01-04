// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  LIMIT_UPDATE_START,
  LIMIT_UPDATE_SUCCESS,
  LIMIT_UPDATE_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

import type { TaskType } from "ducks/inst/types";

// *** Updates limit for inst profile's tasks

/* eslint-disable consistent-return */
export default function* updateLimitSaga({
  payload: { username, type, limitValue }
}: {
  payload: {
    username: string,
    type: TaskType,
    limitValue: string
  }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressLimitUpdate) return true;

  yield put({ type: LIMIT_UPDATE_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const connAccRef = {
        method: "post",
        url: "/api/inst/update-limit",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          username,
          type,
          limitValue
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, connAccRef);
      console.log("Limit should update");
    } else {
      yield put({
        type: LIMIT_UPDATE_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: LIMIT_UPDATE_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}
