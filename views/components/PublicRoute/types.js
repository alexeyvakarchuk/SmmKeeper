// @flow
import * as React from "react";
import type { User } from "ducks/auth/types";

export type State = {
  auth: boolean,
  loading: boolean
};

export type Props = {|
  render: function,
  location?: string
|};
