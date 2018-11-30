// @flow
import type { Acc } from "ducks/inst/types";

export type State = {|
  username: string,
  password: string
|};

export type Props = {|
  accList: null | Acc[],
  popupVisible: boolean,
  error: string
|};
