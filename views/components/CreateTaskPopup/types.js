// @flow
import type { Acc } from "ducks/inst/types";
import type { Tab } from "sections/InstaProfilePage/types";

export type State = {|
  actionSource: string,
  actionType: Tab[],
  activeTab: number
|};

export type Props = {|
  accList: null | Acc[],
  popupVisible: boolean,
  progressCreateTask: boolean,
  error: string,
  username: string,

  closePopup: () => void,
  createTask: ({
    username: string,
    type: string | null,
    sourceUsername: string
  }) => void
|};
