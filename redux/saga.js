import { all } from "redux-saga/effects";
import { watchAuth } from "ducks/auth";
import { watchSocket } from "ducks/socket";
import { watchToDo } from "ducks/todolist";
import { watchPassword } from "ducks/password";

export default function* saga() {
  yield all([watchAuth(), watchSocket(), watchToDo(), watchPassword()]);
}
