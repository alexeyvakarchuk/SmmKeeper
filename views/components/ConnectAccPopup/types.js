// @flow

export type State = {|
  username: string,
  password: string
|};

export type Props = {|
  popupVisible: boolean,
  changePopupVisibility: boolean => void,
  error: string
|};
