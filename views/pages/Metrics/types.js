// @flow

export type Props = {};

type ChartDot = {
  label: string,
  value: number
};

export type State = {
  startDate: null | Object,
  endDate: null | Object,
  focusedInput: null | Object,
  data: ChartDot[]
};
