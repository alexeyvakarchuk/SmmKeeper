// @flow

import type { UserReq } from "ducks/auth/types";

export type State = UserReq;

export type Props = {|
  formState: "SignIn" | "SignUp",
  progress: boolean,
  error: string,
  navigation: Object,

  signIn: (email: string, password: string) => void,
  signUp: (email: string, password: string) => void,
  push: string => void,
  clearAuthError: () => void,
  checkGoogleAuth: () => void
|};
