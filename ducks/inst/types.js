export type StatItem = {|
  followers: number,
  follows: number
|};

export type Acc = {|
  username: string,
  stats: StatItem[]
|};

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
  +progressStartTask: boolean,
  +error: null | string
|};
