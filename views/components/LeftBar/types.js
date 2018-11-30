// @flow
import * as React from "react";
import type { User } from "ducks/auth/types";
import type { Acc } from "ducks/inst/types";

export type State = {};

export type Props = {|
  accList: null | Acc[],
  pathname: string,
  location?: string
|};
