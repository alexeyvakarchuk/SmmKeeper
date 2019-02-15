// @flow
import type { Acc, ResendCodeStatus } from "ducks/inst/types";
import type { Tab } from "sections/InstaProfilePage/types";

export type State = {|
  username: string,
  password: string,
  securityCode: string,
  verificationType: Tab[],
  activeTab: number
|};

export type Props = {|
  accList: null | Acc[],
  popupVisible: boolean,
  progressConnAcc: boolean,
  checkpointUrl: null | string,
  verificationType: null | string,
  resendCodeStatus: ResendCodeStatus,
  error: string,

  closePopup: () => void,
  requestVerification: State => void,
  setVerificationType: ({ verificationType: string }) => void,
  verifyAcc: ({ securityCode: string }) => void,
  resendVerificationCode: ({ username: string, password: string }) => void,
  popupState: "loginInfo" | "verificationType" | "verificationCode"
|};
