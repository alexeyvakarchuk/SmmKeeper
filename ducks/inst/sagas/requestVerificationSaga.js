// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  REQUEST_VERIFICATION_START,
  REQUEST_VERIFICATION_SUCCESS,
  REQUEST_VERIFICATION_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { stateSelector as authStateSelector } from "ducks/auth";

import type { State as AccReq } from "components/connectAccPopup/types";

// *** ACC CONNECTION: STEP 2
// *** Sets verification type(phone or email) when checkpoint(verification is required)

/* eslint-disable consistent-return */
export default function* requestVerificationSaga({
  payload: { username, password }
}: {
  payload: AccReq
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressConnAcc) return true;

  yield put({ type: REQUEST_VERIFICATION_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const ref = {
        method: "post",
        url: "/api/inst/request-verification",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          username,
          password
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { proxy, checkpointUrl }
      } = yield call(axios, ref);

      yield put({
        type: REQUEST_VERIFICATION_SUCCESS,
        payload: {
          proxy,
          checkpointUrl
        }
      });
    } else {
      yield put({
        type: REQUEST_VERIFICATION_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    // if (
    //   res.response.data.error.name &&
    //   res.response.data.error.name === "CheckpointRequiredError"
    // ) {
    //   yield put({
    //     type: CONN_ACC_FAIL_CHECKPOINT,
    //     payload: {
    //       error: "You need to approve your log in",
    //       proxy: res.response.data.error.data.proxy,
    //       checkpointUrl: res.response.data.error.data.checkpointUrl
    //     }
    //   });
    // } else {
    yield put({
      type: REQUEST_VERIFICATION_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
    // }
  }
}
