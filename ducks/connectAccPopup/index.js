// @flow

import { createAction, handleActions, combineActions } from "redux-actions";

import { POPUP_OPEN, POPUP_CLOSE } from "ducks/connectAccPopup/const";
import {
  REQUEST_VERIFICATION_SUCCESS,
  SET_VERIFICATION_TYPE_SUCCESS,
  VERIFY_ACC_SUCCESS,
  CONN_ACC_SUCCESS
} from "ducks/inst/const";
import { SOCKET_CHECKPOINT_REQUIRED } from "ducks/socket/const";
import { SIGN_OUT_SUCCESS } from "ducks/auth/const";

import type { State } from "./types";

/**
 * Constants
 * */

export const moduleName: string = "connectAccPopup";

/**
 * Reducer
 * */

export const initialState: State = {
  visible: false,
  popupState: "loginInfo",
  checkpointUsername: null
};

const connectAccPopupReducer = handleActions(
  {
    [combineActions(POPUP_OPEN, SOCKET_CHECKPOINT_REQUIRED)]: state => ({
      ...state,
      visible: true
    }),
    [POPUP_CLOSE]: state => ({
      ...state,
      visible: false
    }),

    [combineActions(
      REQUEST_VERIFICATION_SUCCESS,
      SOCKET_CHECKPOINT_REQUIRED
    )]: (state, action) => ({
      ...state,
      popupState: "verificationType",
      checkpointUsername: action.payload.username || null
    }),
    [SET_VERIFICATION_TYPE_SUCCESS]: state => ({
      ...state,
      popupState: "verificationCode"
    }),
    [combineActions(VERIFY_ACC_SUCCESS, CONN_ACC_SUCCESS)]: state =>
      initialState,

    [SIGN_OUT_SUCCESS]: () => initialState
  },
  initialState
);

export default connectAccPopupReducer;

/**
 * Selectors
 * */
export const stateSelector = (state: Object): State => state[moduleName];
export const checkpointUsernameSelector = (state: Object): State =>
  state[moduleName].checkpointUsername;

/**
 * Action Creators
 * */

export const openPopup = createAction(POPUP_OPEN);
export const closePopup = createAction(POPUP_CLOSE);
