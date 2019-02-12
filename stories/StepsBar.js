// @flow

import React, { PureComponent } from "react";
import { storiesOf } from "@storybook/react";
import StepsBar from "components/StepsBar";
import "styles/components/_stepsBar.sass";

const steps = [
  {
    name: "Add Info"
  },
  {
    name: "Verification"
  },
  {
    name: "Submit code"
  }
];

storiesOf("StepsBar", module)
  .add("Default(Active first step)", props => {
    return <StepsBar steps={steps} activeStepIndex={0} />;
  })
  .add("Active second step", props => {
    class WrappedStepsBar extends PureComponent<{}, { activeStep: number }> {
      state = { activeStep: 0 };

      componentDidMount() {
        setTimeout(() => this.setState({ activeStep: 1 }), 600);
      }

      render() {
        return (
          <StepsBar steps={steps} activeStepIndex={this.state.activeStep} />
        );
      }
    }

    return <WrappedStepsBar />;
  });
