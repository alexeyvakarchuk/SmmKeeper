// @flow
import type { Task, Acc } from "ducks/inst/types";

export type State = {||};

export type Props = {|
  username: string,
  tasksList: null | Task[],
  progressFetchTasks: boolean,
  accList: Acc[],

  fetchTasks: (username: string, token: string) => void,
  startTask: (username: string, type: string) => void
|};
