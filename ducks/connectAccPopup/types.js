// @flow

export type State = {|
  visible: boolean,
  popupState: "loginInfo" | "verificationType" | "verificationCode",
  checkpointUsername: null | string
|};
