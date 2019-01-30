// @flow

export type Props = {
  inputName: string,
  inputValue: string,
  username: string,
  type?: string,
  style?: "dark" | "light",

  handleChange(string): void,

  searchUsers: (searchPhase: string, username: string) => void
};
