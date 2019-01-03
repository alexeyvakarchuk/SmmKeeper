// @flow

import { createAction, handleActions } from "redux-actions";
import { POPUP_OPEN, POPUP_CLOSE } from "./const";
import { SIGN_OUT_SUCCESS } from "ducks/auth/const";
import type { State } from "./types";

/**
 * Constants
 * */

export const moduleName: string = "createTaskPopup";

/**
 * Reducer
 * */

export const initialState: State = {
  visible: false
};

const createTaskPopupReducer = handleActions(
  {
    [POPUP_OPEN]: state => ({
      ...state,
      visible: true
    }),
    [POPUP_CLOSE]: state => ({
      ...state,
      visible: false
    }),

    [SIGN_OUT_SUCCESS]: () => initialState
  },
  initialState
);

export default createTaskPopupReducer;

/**
 * Selectors
 * */
// export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const openPopup = createAction(POPUP_OPEN);
export const closePopup = createAction(POPUP_CLOSE);
