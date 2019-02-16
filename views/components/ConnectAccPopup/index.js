// @flow

import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import ThreeDots from "icons/ThreeDots";
import User from "icons/User";
import Password from "icons/Password";
import Message from "icons/Message";
import Tabs from "components/Tabs";
import InputField from "components/InputField";
import Button from "components/Button";
import StepsBar from "components/StepsBar";
import {
  requestVerification,
  setVerificationType,
  resendVerificationCode,
  verifyAcc
} from "ducks/inst";
import { closePopup } from "ducks/connectAccPopup";
import type { Props, State } from "./types";

class ConnectAccPopup extends PureComponent<Props, State> {
  state = {
    username: "",
    password: "",
    verificationType: [
      {
        id: 1,
        value: "phone"
      },
      {
        id: 2,
        value: "email"
      }
    ],
    activeTab: 1,
    securityCode: ""
  };

  handleInputChange = (inputName: string) => (value: string) =>
    this.setState({ [inputName]: value });

  handleSubmit = (path: string) => {
    switch (path) {
      case "request-verification":
        return () => this.props.requestVerification(this.state);
      case "set-verification-type":
        return () => {
          const {
            username,
            password,
            verificationType,
            activeTab
          } = this.state;

          const verificationActiveType = verificationType.find(
            el => el.id === activeTab
          );

          this.props.setVerificationType({
            username,
            password,
            verificationType:
              verificationActiveType && verificationActiveType.value
                ? verificationActiveType.value
                : "phone"
          });
        };

      case "verify-acc":
        return () => {
          const { username, password, securityCode } = this.state;

          this.props.verifyAcc({
            username,
            password,
            securityCode
          });
        };

      default:
        console.log("Path is undefined :::");
    }
  };

  componentDidUpdate(prevProps) {
    // Checks whether acc is connected
    if (
      this.props.accList &&
      prevProps.accList &&
      this.props.accList.length !== prevProps.accList.length
    ) {
      this.props.closePopup();
      this.setState({
        username: "",
        password: ""
      });
    }
  }

  handleChangeTab = activeTab => this.setState({ activeTab });

  render() {
    const { progressConnAcc, resendCodeStatus } = this.props;

    const resendCodeClassName = classnames("resendCode", {
      ["resendCode_clickable"]: resendCodeStatus === "clickable",
      ["resendCode_blue"]:
        resendCodeStatus === "clickable" || resendCodeStatus === "progress",
      ["resendCode_green"]: resendCodeStatus === "success"
    });

    let resendCodeContent;

    switch (resendCodeStatus) {
      case "clickable":
        resendCodeContent = "Resend";
        break;
      case "progress":
        resendCodeContent = <ThreeDots />;
        break;
      case "success":
        resendCodeContent = `Check your ${
          this.props.verificationType !== null
            ? ` ${this.props.verificationType}`
            : ""
        }`;
        break;
      default:
        resendCodeContent = "";
    }

    const popupContent = {
      loginInfo: (
        <div className="popup__container">
          <h3>Add new Instagram profile</h3>

          <span className="popup__error-text">{this.props.error}</span>

          <InputField
            inputName="Username"
            inputValue={this.state.username}
            handleChange={this.handleInputChange("username")}
            icon={<User />}
          />
          <InputField
            inputName="Password"
            inputValue={this.state.password}
            handleChange={this.handleInputChange("password")}
            type="password"
            icon={<Password />}
          />
          <Button
            handleClick={this.handleSubmit("request-verification")}
            value="Continue"
            disabled={
              !this.state.username.length || !this.state.password.length
            }
            progress={this.props.progressConnAcc}
          />
        </div>
      ),
      verificationType: (
        <div className="popup__container">
          <h3>Choose the way to approve</h3>

          <span className="popup__error-text">{this.props.error}</span>

          <Tabs
            tabs={this.state.verificationType}
            activeTab={this.state.activeTab}
            handleChangeTab={this.handleChangeTab}
          />

          <Button
            handleClick={this.handleSubmit("set-verification-type")}
            value="Continue"
            progress={this.props.progressConnAcc}
          />
        </div>
      ),
      verificationCode: (
        <div className="popup__container">
          <h3>
            Enter a code from
            {this.props.verificationType !== null
              ? ` ${this.props.verificationType}`
              : ""}
          </h3>

          <span className="popup__error-text">{this.props.error}</span>

          <InputField
            inputName="Security Code"
            inputValue={this.state.securityCode}
            handleChange={this.handleInputChange("securityCode")}
            icon={<Message />}
          />

          <Button
            handleClick={this.handleSubmit("verify-acc")}
            value="Submit"
            disabled={!this.state.securityCode}
            progress={this.props.progressConnAcc}
          />

          <div className="popup__caption">
            Didn't recieve a code?
            <span
              className={resendCodeClassName}
              onClick={() =>
                this.props.resendVerificationCode({
                  username: this.state.username,
                  password: this.state.password
                })
              }
            >
              {resendCodeContent}
            </span>
          </div>
        </div>
      )
    };

    const steps = [
      {
        id: "loginInfo",
        name: "Add Info"
      },
      {
        id: "verificationType",
        name: "Verification type"
      },
      {
        id: "verificationCode",
        name: "Submit code"
      }
    ];

    const activeStepIndex = steps.findIndex(
      el => el.id === this.props.popupState
    );

    return (
      this.props.popupVisible &&
      ReactDOM.createPortal(
        <div
          className="popup popup_connect-acc"
          onClick={this.props.closePopup}
        >
          <div
            className={`popup__content ${
              progressConnAcc ? "popup__content_loading" : ""
            }`}
            onClick={e => e.stopPropagation()}
          >
            <StepsBar steps={steps} activeStepIndex={activeStepIndex} />
            {/* {this.props.checkpointUrl !== null && (
              <InputField
                inputName="securityCode"
                inputValue={this.state.securityCode}
                handleChange={this.handleInputChange("securityCode")}
                
              />
            )} */}
            {popupContent[this.props.popupState]}
          </div>
        </div>,
        // $FlowFixMe
        document.getElementById("connectAccPopup")
      )
    );
  }
}

export default connect(
  ({
    inst: {
      accList,
      checkpointUrl,
      verificationType,
      progressConnAcc,
      error,
      resendCodeStatus
    },
    connectAccPopup: { visible, popupState }
  }) => ({
    accList,
    checkpointUrl,
    verificationType,
    progressConnAcc,
    resendCodeStatus,
    error,
    popupVisible: visible,
    popupState
  }),
  dispatch => ({
    closePopup: () => dispatch(closePopup()),
    resendVerificationCode: ({ username, password }) =>
      dispatch(resendVerificationCode({ username, password })),
    requestVerification: state => dispatch(requestVerification(state)),
    setVerificationType: state => dispatch(setVerificationType(state)),
    verifyAcc: state => dispatch(verifyAcc(state))
  })
)(ConnectAccPopup);
