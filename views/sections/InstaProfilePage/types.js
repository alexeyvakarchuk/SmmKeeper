// @flow
import type { Task } from "ducks/inst/types";

export type State = {||};

export type Props = {|
  username: string,
  +tasksList: null | Task[],

  fetchTasks: (username: string) => void,
  startTask: (username: string, type: string) => void
|};
