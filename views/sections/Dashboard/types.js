// @flow
import type { Acc } from "ducks/inst/types";

export type Props = {
  accList: null | Acc[],
  progress: boolean,
  username: string,

  openPopup: () => void
};

export type State = {
  popupVisible: boolean
};
