// @flow

import axios from "axios";
import { takeEvery, take, put, call, select } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import { stateSelector as authStateSelector } from "ducks/auth";
import { createAction, combineActions, handleActions } from "redux-actions";
import type { State, ToDo } from "./types";

/**
 * Constants
 * */

export const moduleName: string = "todolist";

export const TODO_FETCH_REQUEST: "TODO/TODO_FETCH_REQUEST" =
  "TODO/TODO_FETCH_REQUEST";
export const TODO_FETCH_START: "TODO/TODO_FETCH_START" =
  "TODO/TODO_FETCH_START";
export const TODO_FETCH_SUCCESS: "TODO/TODO_FETCH_SUCCESS" =
  "TODO/TODO_FETCH_SUCCESS";
export const TODO_FETCH_FAIL: "TODO/TODO_FETCH_FAIL" = "TODO/TODO_FETCH_FAIL";

export const TODO_ADD_REQUEST: "TODO/TODO_ADD_REQUEST" =
  "TODO/TODO_ADD_REQUEST";
export const TODO_ADD_START: "TODO/TODO_ADD_START" = "TODO/TODO_ADD_START";
export const TODO_ADD_SUCCESS: "TODO/TODO_ADD_SUCCESS" =
  "TODO/TODO_ADD_SUCCESS";
export const TODO_ADD_FAIL: "TODO/TODO_ADD_FAIL" = "TODO/TODO_ADD_FAIL";

export const TODO_COMPLETE_REQUEST: "TODO/TODO_COMPLETE_REQUEST" =
  "TODO/TODO_COMPLETE_REQUEST";
export const TODO_COMPLETE_START: "TODO/TODO_COMPLETE_START" =
  "TODO/TODO_COMPLETE_START";
export const TODO_COMPLETE_SUCCESS: "TODO/TODO_COMPLETE_SUCCESS" =
  "TODO/TODO_COMPLETE_SUCCESS";
export const TODO_COMPLETE_FAIL: "TODO/TODO_COMPLETE_FAIL" =
  "TODO/TODO_COMPLETE_FAIL";

export const TODO_INCOMPLETE_REQUEST: "TODO/TODO_INCOMPLETE_REQUEST" =
  "TODO/TODO_INCOMPLETE_REQUEST";
export const TODO_INCOMPLETE_START: "TODO/TODO_INCOMPLETE_START" =
  "TODO/TODO_INCOMPLETE_START";
export const TODO_INCOMPLETE_SUCCESS: "TODO/TODO_INCOMPLETE_SUCCESS" =
  "TODO/TODO_INCOMPLETE_SUCCESS";
export const TODO_INCOMPLETE_FAIL: "TODO/TODO_INCOMPLETE_FAIL" =
  "TODO/TODO_INCOMPLETE_FAIL";

/**
 * Reducer
 * */

export const initialState: State = {
  todolist: [],
  progress: false,
  error: null
};

const todoReducer = handleActions(
  {
    [combineActions(TODO_FETCH_START, TODO_ADD_START, TODO_COMPLETE_START)]: (
      state: State
    ) => ({
      ...state,
      progress: true
    }),
    [TODO_ADD_SUCCESS]: (state: State, action) => ({
      ...state,
      todolist: [action.payload.todo, ...state.todolist],
      progress: false,
      error: null
    }),
    [TODO_FETCH_SUCCESS]: (state: State, action) => ({
      ...state,
      todolist: action.payload.todolist,
      progress: false,
      error: null
    }),
    [TODO_COMPLETE_SUCCESS]: (state: State, action) => {
      const newtodolist = state.todolist.slice(0) || [];

      newtodolist.filter(el => el._id === action.payload._id)[0].done = true;

      return {
        ...state,
        todolist: newtodolist,
        progress: false,
        error: null
      };
    },
    [TODO_INCOMPLETE_SUCCESS]: (state: State, action) => {
      const newtodolist = state.todolist.slice(0) || [];

      newtodolist.filter(el => el._id === action.payload._id)[0].done = false;

      return {
        ...state,
        todolist: newtodolist,
        progress: false,
        error: null
      };
    },
    [combineActions(
      TODO_FETCH_FAIL,
      TODO_ADD_FAIL,
      TODO_COMPLETE_FAIL,
      TODO_INCOMPLETE_FAIL
    )]: (state: State, action) => ({
      ...state,
      progress: false,
      error: action.payload.error
    })
  },
  initialState
);

export default todoReducer;

/**
 * Selectors
 * */
export const stateSelector = (state: Object): State => state[moduleName];

/**
 * Action Creators
 * */

export const fetchToDoList = createAction(TODO_FETCH_REQUEST);
export const completeToDo = createAction(TODO_COMPLETE_REQUEST);
export const incompleteToDo = createAction(TODO_INCOMPLETE_REQUEST);
export const addToDo = createAction(TODO_ADD_REQUEST);

/**
 * Sagas
 * */

export function* fetchToDoListSaga(): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: TODO_FETCH_START });

  try {
    const { user } = yield select(authStateSelector);

    if (user.id) {
      const fetchToDoListRef = {
        method: "post",
        url: "/api/todo/fetch",
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken")
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { todolist }
      } = yield call(axios, fetchToDoListRef);
      yield put({
        type: TODO_FETCH_SUCCESS,
        payload: { todolist }
      });
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: TODO_FETCH_FAIL,
      payload: {
        error: err
      }
    });
  }
}

export function* addToDoSaga({
  payload: { name }
}: {
  payload: ToDo
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress) return true;

  yield put({ type: TODO_ADD_START });

  try {
    const { user } = yield select(authStateSelector);
    if (user.id) {
      const addToDoRef = {
        method: "post",
        url: "/api/todo/add",
        data: {
          id: user.id,
          token: localStorage.getItem("tktoken"),
          name
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { todo }
      } = yield call(axios, addToDoRef);
    } else {
      yield put({
        type: TODO_ADD_FAIL,
        payload: {
          error: "Can't find user id or email"
        }
      });
    }
  } catch (err) {
    yield put({
      type: TODO_ADD_FAIL,
      payload: {
        error: err
      }
    });
  }
}

export function* completeToDoSaga({
  payload: { _id }
}: {
  payload: ToDo
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress || state.error) return true;

  yield put({ type: TODO_COMPLETE_START });

  try {
    const { user } = yield select(authStateSelector);
    if (user.id) {
      const addToDoRef = {
        method: "post",
        url: "/api/todo/complete",
        data: {
          userId: user.id,
          token: localStorage.getItem("tktoken"),
          todoId: _id
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { todo }
      } = yield call(axios, addToDoRef);
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: TODO_COMPLETE_FAIL,
      payload: {
        error: err
      }
    });
  }
}

export function* incompleteToDoSaga({
  payload: { _id }
}: {
  payload: ToDo
}): Generator<any, any, any> {
  const state = yield select(stateSelector);

  if (state.progress || state.error) return true;

  yield put({ type: TODO_INCOMPLETE_START });

  try {
    const { user } = yield select(authStateSelector);
    if (user.id) {
      const addToDoRef = {
        method: "post",
        url: "/api/todo/incomplete",
        data: {
          userId: user.id,
          token: localStorage.getItem("tktoken"),
          todoId: _id
        },
        headers: {
          "Content-Type": "application/json"
        }
      };

      const {
        data: { todo }
      } = yield call(axios, addToDoRef);
    } else {
      throw "Can't find user id or email";
    }
  } catch (err) {
    yield put({
      type: TODO_INCOMPLETE_FAIL,
      payload: {
        error: err
      }
    });
  }
}

export function* watchToDo(): mixed {
  yield takeEvery(TODO_FETCH_REQUEST, fetchToDoListSaga);
  yield takeEvery(TODO_ADD_REQUEST, addToDoSaga);
  yield takeEvery(TODO_COMPLETE_REQUEST, completeToDoSaga);
  yield takeEvery(TODO_INCOMPLETE_REQUEST, incompleteToDoSaga);
}
