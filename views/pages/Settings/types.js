// @flow

import type { UserReq } from "ducks/auth/types";

export type State = {};

export type Props = {
  passwordExists: null | boolean,

  clearMessages: () => void
};

export type UpdatePasswordSectionState = {
  password: string,
  newPassword: string,
  newPasswordConfirm: string
};

export type UpdatePasswordSectionProps = {
  passwordError?: string,
  successMessage?: string,
  updatePassword: UpdatePasswordSectionState => void
};

export type SetPasswordSectionState = {
  password: string,
  passwordConfirm: string
};

export type SetPasswordSectionProps = {
  ...UpdatePasswordSectionProps,
  setPassword: SetPasswordSectionState => void
};
