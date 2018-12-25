// @flow
import type { Task } from "ducks/inst/types";
import type { OptionType } from "react-select/src/types";

export type State = {|
  selectedOption: OptionType | null
|};

export type Props = {|
  username: string,
  tasksList: null | Task[],

  openPopup: () => void
|};