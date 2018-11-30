export type Acc = {|
  username: string
|};

export type Task = {|
  username: string
|};

export type State = {|
  +accList: null | Acc[],
  +tasksList: null | Task[],
  +progressFetchAccs: boolean,
  +progressFetchTasks: boolean,
  +progressConnAcc: boolean,
  +progressStartTask: boolean,
  +error: null
|};
