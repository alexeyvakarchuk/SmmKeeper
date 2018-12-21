// @flow

import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Tabs from "components/Tabs";
import InputField from "components/InputField";
import GradientButton from "components/GradientButton";
import type { Props, State } from "./types";
import {
  requestVerification,
  setVerificationType,
  verifyAcc
} from "ducks/inst";
import { openPopup, closePopup } from "ducks/connectAccPopup";

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
    const popupContent = {
      loginInfo: (
        <div className="popup__container">
          <h3>Enter username&password from your instagram account, please</h3>

          <span className="popup__error-text">{this.props.error}</span>

          <InputField
            inputName="username"
            inputValue={this.state.username}
            handleChange={this.handleInputChange("username")}
            style="light"
          />
          <InputField
            inputName="Password"
            inputValue={this.state.password}
            handleChange={this.handleInputChange("password")}
            style="light"
            type="password"
          />
          <GradientButton
            className="popup__submit-button"
            handleClick={this.handleSubmit("request-verification")}
            value={"Confirm"}
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

          <GradientButton
            className="popup__submit-button"
            handleClick={this.handleSubmit("set-verification-type")}
            value={"Confirm"}
          />
        </div>
      ),
      verificationCode: (
        <div className="popup__container">
          <h3>
            You're almost done! Enter code from your
            {this.props.verificationType !== null
              ? ` ${this.props.verificationType} `
              : ""}
            message below, please
          </h3>

          <span className="popup__error-text">{this.props.error}</span>

          <InputField
            inputName="securityCode"
            inputValue={this.state.securityCode}
            handleChange={this.handleInputChange("securityCode")}
            style="light"
          />

          <GradientButton
            className="popup__submit-button"
            handleClick={this.handleSubmit("verify-acc")}
            value={"Confirm"}
          />
        </div>
      )
    };

    const { progressConnAcc } = this.props;

    return (
      this.props.popupVisible &&
      ReactDOM.createPortal(
        <div className="popup" onClick={this.props.closePopup}>
          <div
            className={`popup__content ${
              progressConnAcc ? "popup__content_loading" : ""
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="popup__close" onClick={this.props.closePopup} />

            {/* {this.props.checkpointUrl !== null && (
              <InputField
                inputName="securityCode"
                inputValue={this.state.securityCode}
                handleChange={this.handleInputChange("securityCode")}
                style="light"
              />
            )} */}

            {popupContent[this.props.popupState]}
          </div>
        </div>,
        // $FlowFixMe
        document.getElementById("modalRoot")
      )
    );
  }
}

export default connect(
  ({
    inst: { accList, checkpointUrl, verificationType, progressConnAcc, error },
    connectAccPopup: { visible, popupState }
  }) => ({
    accList,
    checkpointUrl,
    verificationType,
    progressConnAcc,
    error,
    popupVisible: visible,
    popupState
  }),
  dispatch => ({
    openPopup: () => dispatch(openPopup()),
    closePopup: () => dispatch(closePopup()),
    // connectAcc: state => dispatch(connectAcc(state))
    requestVerification: state => dispatch(requestVerification(state)),
    setVerificationType: state => dispatch(setVerificationType(state)),
    verifyAcc: state => dispatch(verifyAcc(state))
  })
)(ConnectAccPopup);
