// @flow

import type { StatItem } from "ducks/Inst/types";

export type Props = {
  data: StatItem[]
};

type ChartDot = {
  label: string,
  value: number
};

export type State = {
  filter: null | string
};
