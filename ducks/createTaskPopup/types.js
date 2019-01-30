// @flow

export type SearchUserResult = {|
  username: string,
  profilePic: string,
  followers: string
|};

export type State = {|
  visible: boolean,
  searchResults: SearchUserResult[],
  searchProgress: boolean
|};
