// @flow
import * as React from "react";
import type { User } from "ducks/auth/types";

export type State = {
  auth: boolean,
  loading: boolean
};

export type Props = {|
  user: Object,
  // Component: Object,
  location?: string,
  render: function
|};
