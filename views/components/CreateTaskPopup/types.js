// @flow
import type { Acc } from "ducks/inst/types";
import type { SearchUserResult } from "ducks/createTaskPopup/types";
import type { OptionType } from "react-select/src/types";

export type State = {|
  actionSource: OptionType | null,
  actionType: OptionType | null
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
