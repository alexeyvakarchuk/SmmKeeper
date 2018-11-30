// @flow
import type { Acc } from "ducks/inst/types";

export type Props = {
  accList: null | Acc[],
  progress: boolean
};

export type State = {
  popupVisible: boolean
};
