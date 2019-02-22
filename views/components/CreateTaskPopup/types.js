// @flow
import type { Acc, TaskFilters } from "ducks/inst/types";
import type { SearchUserResult } from "ducks/createTaskPopup/types";
import type { OptionType } from "react-select/src/types";

export type State = {|
  actionSource: OptionType | null,
  actionType: OptionType | null,
  filters: TaskFilters
|};

export type Props = {|
  accList: null | Acc[],
  popupVisible: boolean,
  progressCreateTask: boolean,
  error: string,
  username: string,
  searchProgress: boolean,
  searchResults: SearchUserResult[],

  closePopup: () => void,
  clearSearchResults: () => void,
  createTask: ({
    username: string,
    type: string | null,
    sourceUsername: string
  }) => void
|};
