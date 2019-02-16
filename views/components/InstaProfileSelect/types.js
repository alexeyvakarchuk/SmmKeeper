// @flow

import type { SearchUserResult } from "ducks/createTaskPopup/types";
import type { OptionType } from "react-select/src/types";

export type Props = {
  inputName: string,
  placeholder: string,
  username: string,
  searchProgress: boolean,
  searchResults: SearchUserResult[],
  value: OptionType | null,

  handleChange: string => void,
  clearSearchResults: () => void,

  searchUsers: (searchPhase: string, username: string) => void
};

export type State = {|
  menuIsOpen: boolean
|};
