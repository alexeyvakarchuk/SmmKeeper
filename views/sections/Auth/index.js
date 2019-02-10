// @flow

import React, { Component } from "react";
import InputField from "components/InputField";
import { connect } from "react-redux";
import { signIn, signUp, checkGoogleAuth, clearAuthError } from "ducks/auth";
import OutlineButton from "components/OutlineButton";
import Button from "components/Button";
import type { Props, State } from "./types";
import { fetchUserAuth } from "utils";
import Router from "next/router";

class AuthPage extends Component<Props, State> {
  state = {
    email: "",
    password: ""
  };

  handleInputChange = inputName => value =>
    this.setState({ [inputName]: value });

  handleSubmit = () => {
    this.props.formState === "SignUp"
      ? this.props.signUp(this.state.email, this.state.password)
      : this.props.signIn(this.state.email, this.state.password);
  };

  openRegisterWindow = (url, wnidowName) => {
    const { clientWidth, clientHeight } = window.document.documentElement;

    const popup = {
      width: 500,
      height: 500
    };

    const topBarHeight = window.outerHeight - clientHeight;

    const specs = `width=${popup.width},
    height=${popup.height},
    top=${(clientHeight - popup.height) / 2 + topBarHeight},
    left=${(clientWidth - popup.width) / 2}`;

    window.open(url, wnidowName, specs);
  };

  render() {
    return (
      <section className="auth">
        <h2 className="auth__heading">
          {this.props.formState === "SignUp" ? "Create Account" : "Log in"}
        </h2>

        <span className="auth__error-text">{this.props.error}</span>

        <InputField
          inputName="Email"
          inputValue={this.state.email}
          handleChange={this.handleInputChange("email")}
        />

        <InputField
          inputName="Password"
          type="password"
          inputValue={this.state.password}
          handleChange={this.handleInputChange("password")}
        />

        <Button
          handleClick={this.handleSubmit}
          value={this.props.formState === "SignUp" ? "Sign Up" : "Sign In"}
        />

        <div className="auth__divider">or</div>

        <div className="auth__socials">
          <OutlineButton
            value="Google"
            handleClick={() => {
              this.props.checkGoogleAuth();
              this.openRegisterWindow("/api/sign-in/google", "google_popup");
            }}
          />
          {/* <OutlineButton value="Facebook" />
          <OutlineButton value="GitHub" /> */}
        </div>

        <div className="auth__bottom-text">
          {this.props.formState === "SignUp"
            ? "Already have an account?"
            : "Haven't got an account?"}
          <span
            onClick={() => {
              if (this.props.error) {
                this.props.clearAuthError();
              }

              this.props.formState === "SignUp"
                ? Router.push("/signIn")
                : Router.push("/signUp");
            }}
          >
            {this.props.formState === "SignUp" ? "Sign in" : "Sign up"}
          </span>
        </div>
      </section>
    );
  }
}

export default connect(
  ({ auth: { progress, error } }) => ({
    progress,
    error
  }),
  dispatch => ({
    signIn: (email, password) =>
      dispatch(
        signIn({
          email,
          password
        })
      ),
    signUp: (email, password) =>
      dispatch(
        signUp({
          email,
          password
        })
      ),
    clearAuthError: () => dispatch(clearAuthError()),
    checkGoogleAuth: () => dispatch(checkGoogleAuth())
  })
)(AuthPage);
