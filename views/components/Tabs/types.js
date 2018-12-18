// @flow

import type { Tab } from "sections/InstaProfilePage/types";

export type Props = {|
  tabs: Tab[],
  activeTab: number,
  handleChangeTab: (activeTab: number) => void
|};

export type State = {||};
