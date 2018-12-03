// @flow

export type State = {||};

export type Props = {|
  location?: string,

  socketConnect: () => void,
  fetchAccs: () => void,
  checkPasswordExistence: () => void
|};
