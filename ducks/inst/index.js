// @flow

import axios from "axios";
import moment from "moment";
import { all, take, takeEvery, put, call, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { createAction, handleActions, combineActions } from "redux-actions";
import { baseURL } from "config";

// *** Const
import {
  // Acc connecting const
  REQUEST_VERIFICATION_REQUEST,
  REQUEST_VERIFICATION_START,
  REQUEST_VERIFICATION_SUCCESS,
  REQUEST_VERIFICATION_FAIL,
  SET_VERIFICATION_TYPE_REQUEST,
  SET_VERIFICATION_TYPE_START,
  SET_VERIFICATION_TYPE_SUCCESS,
  SET_VERIFICATION_TYPE_FAIL,
  VERIFY_ACC_REQUEST,
  VERIFY_ACC_START,
  VERIFY_ACC_SUCCESS,
  VERIFY_ACC_FAIL,
  CONN_ACC_SUCCESS,
  // Rest
  FETCH_ACCS_REQUEST,
  FETCH_ACCS_START,
  FETCH_ACCS_SUCCESS,
  FETCH_ACCS_FAIL,
  CLEAR_CONN_ERROR,
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_START,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAIL,
  TASK_CREATE_REQUEST,
  TASK_CREATE_START,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_FAIL,
  STATS_UPDATE_REQUEST,
  STATS_UPDATE_START,
  STATS_UPDATE_SUCCESS,
  STATS_UPDATE_FAIL,
  LIMIT_UPDATE_REQUEST,
  LIMIT_UPDATE_START,
  LIMIT_UPDATE_SUCCESS,
  LIMIT_UPDATE_FAIL
} from "ducks/inst/const";
import { SIGN_OUT_SUCCESS } from "ducks/auth/const";

// *** Sagas

// Profile connection
import requestVerificationSaga from "ducks/inst/sagas/requestVerificationSaga";
import setVerificationTypeSaga from "ducks/inst/sagas/setVerificationTypeSaga";
import verifyAccSaga from "ducks/inst/sagas/verifyAccSaga";

// Fetching data
import fetchAccsSaga from "ducks/inst/sagas/fetchAccsSaga";

// Stats and limits
import statsUpdateSaga from "ducks/inst/sagas/statsUpdateSaga";
import updateLimitSaga from "ducks/inst/sagas/updateLimitSaga";

// Tasks
import fetchTasksSaga from "ducks/inst/sagas/fetchTasksSaga";
import createTaskSaga from "ducks/inst/sagas/createTaskSaga";

// *** Types
import type { State } from "./types";

/**
 * Reducer
 * */

export const initialState: State = {
  accList: null,
  tasksList: null,
  proxy: null,
  checkpointUrl: null,
  verificationType: null,
  progressFetchAccs: false,
  progressFetchTasks: false,
  progressStatsUpdate: false,
  progressConnAcc: false,
  progressCreateTask: false,
  progressLimitUpdate: false,
  error: null
};

const instReducer = handleActions(
  {
    [REQUEST_VERIFICATION_START]: (state: State) => ({
      ...state,
      progressConnAcc: true,
      error: null
    }),
    [REQUEST_VERIFICATION_SUCCESS]: (state: State, action) => ({
      ...state,
      progressConnAcc: false,
      error: null,
      proxy: action.payload.proxy,
      checkpointUrl: action.payload.checkpointUrl
    }),
    [REQUEST_VERIFICATION_FAIL]: (state: State, action) => ({
      ...state,
      progressConnAcc: false,
      error: action.payload.error
    }),

    [SET_VERIFICATION_TYPE_START]: (state: State) => ({
      ...state,
      progressConnAcc: true,
      error: null
    }),
    [SET_VERIFICATION_TYPE_SUCCESS]: (state: State, action) => ({
      ...state,
      error: null,
      progressConnAcc: false,
      verificationType: action.payload.verificationType
    }),
    [SET_VERIFICATION_TYPE_FAIL]: (state: State, action) => ({
      ...state,
      progressConnAcc: false,
      error: action.payload.error
    }),

    [VERIFY_ACC_START]: (state: State) => ({
      ...state,
      progressConnAcc: true,
      error: null
    }),
    [VERIFY_ACC_SUCCESS]: (state: State, action) => ({
      ...state,
      error: null,
      progressConnAcc: false
    }),
    [VERIFY_ACC_FAIL]: (state: State, action) => ({
      ...state,
      progressConnAcc: false,
      error: action.payload.error
    }),

    [CONN_ACC_SUCCESS]: (state: State, action) => ({
      ...state,
      progressConnAcc: false,
      error: null,
      proxy: null,
      checkpointUrl: null,
      verificationType: null,
      accList: [...state.accList, action.payload.acc]
    }),

    [FETCH_ACCS_START]: (state: State) => ({
      ...state,
      progressFetchAccs: true,
      error: null
    }),
    [FETCH_ACCS_SUCCESS]: (state: State, action) => ({
      ...state,
      progressFetchAccs: false,
      error: null,
      accList: action.payload.accList
    }),
    [FETCH_ACCS_FAIL]: (state: State, action) => ({
      ...state,
      progressFetchAccs: false,
      error: action.payload.error
    }),

    [FETCH_TASKS_START]: (state: State) => ({
      ...state,
      progressFetchTasks: true,
      error: null
    }),
    [FETCH_TASKS_SUCCESS]: (state: State, action) => ({
      ...state,
      progressFetchTasks: false,
      error: null,
      tasksList: action.payload.tasksList
    }),
    [FETCH_TASKS_FAIL]: (state: State, action) => ({
      ...state,
      progressFetchTasks: false,
      error: action.payload.error
    }),

    [STATS_UPDATE_START]: (state: State) => ({
      ...state,
      progressStatsUpdate: true,
      error: null
    }),
    [STATS_UPDATE_SUCCESS]: (state: State, action) => ({
      ...state,
      progressStatsUpdate: false,
      error: null,
      accList: state.accList.map(
        acc =>
          acc.username === action.payload.username ? action.payload.acc : acc
      )
    }),
    [STATS_UPDATE_FAIL]: (state: State, action) => ({
      ...state,
      progressStatsUpdate: false,
      error: action.payload.error
    }),

    [TASK_CREATE_START]: (state: State) => ({
      ...state,
      progressCreateTask: true,
      error: null
    }),
    [TASK_CREATE_SUCCESS]: (state: State, action) => ({
      ...state,
      tasksList: [...state.tasksList, action.payload.task],
      progressCreateTask: false,
      error: null
    }),
    [TASK_CREATE_FAIL]: (state: State, action) => ({
      ...state,
      progressCreateTask: false,
      error: action.payload.error
    }),

    [LIMIT_UPDATE_START]: (state: State, action) => ({
      ...state,
      progressLimitUpdate: true,
      error: null
    }),
    [LIMIT_UPDATE_SUCCESS]: (state: State, action) => ({
      ...state,
      progressLimitUpdate: false,
      error: null,
      accList: state.accList.map(
        acc =>
          acc.username === action.payload.username
            ? {
                ...acc,
                limits: {
                  ...acc.limits,
                  [action.payload.type]: {
                    ...acc.limits[action.payload.type],
                    current: action.payload.limitValue
                  }
                }
              }
            : acc
      )
    }),

    [LIMIT_UPDATE_FAIL]: (state: State, action) => ({
      ...state,
      progressLimitUpdate: false,
      error: action.payload.error
    }),

    [SIGN_OUT_SUCCESS]: () => initialState,

    [CLEAR_CONN_ERROR]: (state: State, action) => ({
      ...state,
      error: null
    })
  },
  initialState
);

export default instReducer;

/**
 * Selectors
 * */

/**
 * Action Creators
 * */

// Profile connection
export const requestVerification = createAction(REQUEST_VERIFICATION_REQUEST);
export const setVerificationType = createAction(SET_VERIFICATION_TYPE_REQUEST);
export const verifyAcc = createAction(VERIFY_ACC_REQUEST);

// Fetching data
export const fetchAccs = createAction(FETCH_ACCS_REQUEST);

// Stats and limits
export const updateStats = createAction(STATS_UPDATE_REQUEST);
export const updateLimit = createAction(LIMIT_UPDATE_REQUEST);

// Tasks
export const fetchTasks = createAction(FETCH_TASKS_REQUEST);
export const createTask = createAction(TASK_CREATE_REQUEST);

/**
 * Sagas
 * */

export function* watchInst(): mixed {
  // Profile connection
  yield takeEvery(REQUEST_VERIFICATION_REQUEST, requestVerificationSaga);
  yield takeEvery(SET_VERIFICATION_TYPE_REQUEST, setVerificationTypeSaga);
  yield takeEvery(VERIFY_ACC_REQUEST, verifyAccSaga);

  // Fetching data
  yield takeEvery(FETCH_ACCS_REQUEST, fetchAccsSaga);

  // Stats and limits
  yield takeEvery(STATS_UPDATE_REQUEST, statsUpdateSaga);
  yield takeEvery(LIMIT_UPDATE_REQUEST, updateLimitSaga);

  // Tasks
  yield takeEvery(FETCH_TASKS_REQUEST, fetchTasksSaga);
  yield takeEvery(TASK_CREATE_REQUEST, createTaskSaga);
}
