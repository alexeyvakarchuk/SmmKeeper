// @flow

import type { SearchUserResult } from "ducks/createTaskPopup/types";

export type Props = {
  inputName: string,
  inputValue: string,
  username: string,
  type?: string,
  style?: "dark" | "light",
  searchProgress: boolean,
  searchResults: SearchUserResult[],

  handleChange(string): void,

  searchUsers: (searchPhase: string, username: string) => void
};
