export type Acc = {|
  userName: string
|};

export type State = {|
  +accList: null | Acc[],
  +progress: false,
  +error: null
|};
