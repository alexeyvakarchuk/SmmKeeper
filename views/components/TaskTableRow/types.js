// @flow
export type State = {|
  checked: boolean
|};

export type Props = {|
  _id: string,
  unteractionsNum: number,
  sourceUsername: string,
  type: string,
  status: number,
  startDate: string,
  handleRowSelect: (_id: string) => void,
  handleRowDeselect: (_id: string) => void,
  selectedTasks: string[]
|};
