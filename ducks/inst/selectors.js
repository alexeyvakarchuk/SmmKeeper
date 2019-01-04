// @flow

import { moduleName } from "ducks/inst/const";

import type { State } from "ducks/inst/types";

export const stateSelector = (state: Object): State => state[moduleName];
