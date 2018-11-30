// @flow

import { createAction, handleActions } from "redux-actions";
import type { State } from "./types";

/**
 * Constants
 * */

export const moduleName: string = "connectAccPopup";

export const POPUP_OPEN: "CONNECT-ACC-POPUP/POPUP_OPEN" =
  "CONNECT-ACC-POPUP/POPUP_OPEN";

export const POPUP_CLOSE: "CONNECT-ACC-POPUP/POPUP_CLOSE" =
  "CONNECT-ACC-POPUP/POPUP_CLOSE";

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
    })
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
