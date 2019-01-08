export type StatItem = {|
  followers: number,
  follows: number
|};

export type Acc = {|
  username: string,
  stats: StatItem[]
|};

export type TaskType = "mf" | "ml";

export type Task = {|
  username: string
|};

export type State = {|
  +accList: null | Acc[],
  +tasksList: null | Task[],
  +proxy: null | Object,
  +checkpointUrl: null | string,
  +verificationType: null | string,
  +progressFetchAccs: boolean,
  +progressFetchTasks: boolean,
  +progressConnAcc: boolean,
  +progressCreateTask: boolean,
  +porgressTasksUpdate: boolean,
  +progressLimitUpdate: boolean,
  +error: null | string
|};
