// @flow
import type { OptionType, OptionsType } from "react-select/src/types";

export type Option = {|
  value: string,
  label: string
|};

export type State = {|
  menuIsOpen: boolean
|};

export type Props = {|
  instanceId: string,
  value: OptionType | null,
  onChange: (value: OptionType | null) => void,
  options: OptionType[],
  placeholder: string
|};
