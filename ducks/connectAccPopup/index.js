// @flow

import { createAction, handleActions } from "redux-actions";
// import { SIGN_OUT_SUCCESS } from "ducks/auth";
// console.log(SIGN_OUT_SUCCESS);
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
  visible: false
};

const connectAccPopupReducer = handleActions(
  {
    [POPUP_OPEN]: () => ({
      visible: true
    }),
    [POPUP_CLOSE]: () => ({
      visible: false
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
