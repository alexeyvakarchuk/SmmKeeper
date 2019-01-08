// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  VERIFY_ACC_START,
  VERIFY_ACC_SUCCESS,
  VERIFY_ACC_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { checkpointUsernameSelector } from "ducks/connectAccPopup";
import { stateSelector as authStateSelector } from "ducks/auth";

import type { State as AccReq } from "components/connectAccPopup/types";

// *** ACC CONNECTION: STEP 3
// *** Verifies acc when user submit's verification code from his phone/email

/* eslint-disable consistent-return */
export default function* verifyAccSaga({
  payload: { username, password, securityCode }
}: {
  payload: { ...AccReq, securityCode: string }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressConnAcc) return true;

  yield put({ type: VERIFY_ACC_START });

  try {
    const { user } = yield select(authStateSelector);

    const checkpointUsername = yield select(checkpointUsernameSelector);

    if (user.id) {
      const ref = {
        method: "post",
        url: "/api/inst/verify-acc",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          proxy: state.proxy,
          checkpointUrl: state.checkpointUrl,
          username: username || checkpointUsername,
          password,
          securityCode
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, ref);

      yield put({
        type: VERIFY_ACC_SUCCESS
      });
    } else {
      yield put({
        type: VERIFY_ACC_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: VERIFY_ACC_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}
