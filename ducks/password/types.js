// @flow

export type State = {|
  +passwordExists: null | boolean,
  +updated: boolean,
  +progress: boolean,
  +successMessage: null | string,
  +error: null | string
|};
