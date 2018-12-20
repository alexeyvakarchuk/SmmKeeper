// @flow
import type { Acc } from "ducks/inst/types";

export type State = {|
  username: string,
  password: string,
  securityCode: string
|};

export type Props = {|
  accList: null | Acc[],
  popupVisible: boolean,
  checkpointUrl: null | string,
  error: string,

  openPopup: () => void,
  closePopup: () => void,
  connectAcc: State => void
|};
