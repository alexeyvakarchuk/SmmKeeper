import { all } from "redux-saga/effects";
import { watchAuth } from "ducks/auth";
import { watchSocket } from "ducks/socket";
import { watchInst } from "ducks/inst";
import { watchPassword } from "ducks/password";
import { watchCreateTaskPopup } from "ducks/createTaskPopup";

export default function* saga() {
  yield all([
    watchAuth(),
    watchSocket(),
    watchInst(),
    watchPassword(),
    watchCreateTaskPopup()
  ]);
}
