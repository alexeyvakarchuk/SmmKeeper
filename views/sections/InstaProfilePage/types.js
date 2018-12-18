// @flow
import type { Task, Acc } from "ducks/inst/types";

export type Tab = {|
  id: number,
  value: string
|};

export type State = {|
  tabs: Tab[],
  activeTab: number
|};

export type Props = {|
  username: string,
  tasksList: null | Task[],
  progressFetchTasks: boolean,
  accList: Acc[],

  fetchTasks: (username: string, token: string) => void,
  startTask: (username: string, type: string) => void,
  updateLimit: (username: string, type: string, limitValue: number) => void
|};
