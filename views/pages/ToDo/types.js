// @flow

import type { ToDo } from "ducks/todolist/types";

export type Props = {
  todolist: ToDo[]
};

export type State = {
  showCompleted: boolean
};
