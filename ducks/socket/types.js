// @flow

export type State = {|
  +progress: boolean,
  +connected: boolean,
  +auth: boolean,
  +error: null | string
|};
