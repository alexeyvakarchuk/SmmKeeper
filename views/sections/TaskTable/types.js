// @flow
import type { Task } from "ducks/inst/types";
import type { OptionType } from "react-select/src/types";

export type State = {|
  selectedAction: OptionType | null,
  selectedFilter: OptionType | null,
  selectedTasks: string[]
|};

export type Props = {|
  username: string,
  tasksList: null | Task[],

  openPopup: () => void
|};
