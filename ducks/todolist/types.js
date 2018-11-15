// @flow

export type State = {|
  +todolist: ToDo[],
  +progress: boolean,
  +error: null | string
|};

export type ToDo = {
  _id: string,
  name: string,
  done: boolean,
  starred: string,
  createdAt: string,
  updatedA: string
};
