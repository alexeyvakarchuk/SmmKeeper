// @flow

import { createAction, handleActions } from "redux-actions";
// import { SIGN_OUT_SUCCESS } from "ducks/auth";
// console.log(SIGN_OUT_SUCCESS);
import {
  REQUEST_VERIFICATION_SUCCESS,
  SET_VERIFICATION_TYPE_SUCCESS
} from "ducks/inst/const";
import { POPUP_OPEN, POPUP_CLOSE } from "./const";
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
  popupState: "loginInfo"
};

const connectAccPopupReducer = handleActions(
  {
    [POPUP_OPEN]: state => ({
      ...state,
      visible: true
    }),
    [POPUP_CLOSE]: state => ({
      ...state,
      visible: false
    }),

    [REQUEST_VERIFICATION_SUCCESS]: state => ({
      ...state,
      popupState: "verificationType"
    }),
    [SET_VERIFICATION_TYPE_SUCCESS]: state => ({
      ...state,
      popupState: "verificationCode"
    }),

    [SIGN_OUT_SUCCESS]: () => initialState
  },
  initialState
);

export default connectAccPopupReducer;

/**
 * Selectors
 * */
// export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const openPopup = createAction(POPUP_OPEN);
export const closePopup = createAction(POPUP_CLOSE);
