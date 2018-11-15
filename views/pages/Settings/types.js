// @flow

import type { UserReq } from "ducks/auth/types";

export type Props = {
  passwordExists: null | boolean
};

export type State = {};

export type UpdatePasswordSectionState = {
  password: string,
  newPassword: string,
  newPasswordConfirm: string
};

export type UpdatePasswordSectionProps = {
  passwordError?: string,
  successMessage?: string
};

export type SetPasswordSectionState = {
  password: string,
  passwordConfirm: string
};
