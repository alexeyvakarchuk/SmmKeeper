// @flow

import axios from "axios";
import { put, call, select } from "redux-saga/effects";
import { baseURL } from "config";

import {
  SET_VERIFICATION_TYPE_START,
  SET_VERIFICATION_TYPE_SUCCESS,
  SET_VERIFICATION_TYPE_FAIL
} from "ducks/inst/const";

import { stateSelector } from "ducks/inst/selectors";
import { checkpointUsernameSelector } from "ducks/connectAccPopup";
import { stateSelector as authStateSelector } from "ducks/auth";

import type { State as AccReq } from "components/connectAccPopup/types";

// *** ACC CONNECTION: STEP 2
// *** Sets verification type(phone or email) when checkpoint(verification is required)

/* eslint-disable consistent-return */
export default function* setVerificationTypeSaga({
  payload: { username, password, verificationType }
}: {
  payload: { ...AccReq, verificationType: "phone" | "email" }
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progressConnAcc) return true;

  yield put({ type: SET_VERIFICATION_TYPE_START });

  try {
    const { user } = yield select(authStateSelector);

    const checkpointUsername = yield select(checkpointUsernameSelector);

    if (user.id) {
      const ref = {
        method: "post",
        url: "/api/inst/set-verification-type",
        baseURL,
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          proxy: state.proxy,
          checkpointUrl: state.checkpointUrl,
          username: username || checkpointUsername,
          password,
          verificationType
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      yield call(axios, ref);

      yield put({
        type: SET_VERIFICATION_TYPE_SUCCESS,
        payload: {
          verificationType
        }
      });
    } else {
      yield put({
        type: SET_VERIFICATION_TYPE_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (res) {
    yield put({
      type: SET_VERIFICATION_TYPE_FAIL,
      payload: {
        error: res.response.data.error.message
      }
    });
  }
}
