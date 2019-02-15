// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  RESEND_VERIFICATION_CODE_START,
  RESEND_VERIFICATION_CODE_SUCCESS,
  RESEND_VERIFICATION_CODE_FAIL,
  CHANGE_RESEND_CODE_STATUS
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { checkpointUsernameSelector } from "ducks/connectAccPopup";
import { stateSelector as authStateSelector } from "ducks/auth";

import { delay } from "ducks/inst/utils";

import type { State as AccReq } from "components/connectAccPopup/types";

// *** RESEND VERIFICATION CODE
// *** Resends code to user's email/phone if needed (usually on acc connection step 3)

/* eslint-disable consistent-return */
export default function* resendVerificationCodeSaga({
  payload: { username, password }
}: {
  payload: { ...AccReq }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.resendCodeStatus !== "clickable") return true;

  yield put({ type: RESEND_VERIFICATION_CODE_START });

  try {
    const { user } = yield select(authStateSelector);

    const checkpointUsername = yield select(checkpointUsernameSelector);

    if (user.id) {
      const ref = {
        method: "post",
        url: "/api/inst/resend-verification-code",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          proxy: state.proxy,
          checkpointUrl: state.checkpointUrl,
          username: username || checkpointUsername,
          password
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, ref);

      yield put({
        type: RESEND_VERIFICATION_CODE_SUCCESS
      });

      yield call(delay, 5);

      yield put({
        type: CHANGE_RESEND_CODE_STATUS,
        payload: {
          resendCodeStatus: "clickable"
        }
      });
    } else {
      yield put({
        type: RESEND_VERIFICATION_CODE_FAIL,
        payload: {
          error: "Verification code resend failed"
        }
      });
    }
  } catch (res) {
    yield put({
      type: RESEND_VERIFICATION_CODE_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}
