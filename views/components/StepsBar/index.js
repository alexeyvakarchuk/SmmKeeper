// @flow

import React, { PureComponent } from "react";
import ReactTooltip from "react-tooltip";
import type { Props, State } from "./types";

export default class StepsBar extends PureComponent<Props, State> {
  render() {
    const { steps, activeStepIndex } = this.props;

    const stepWidth = 100 / (steps.length - 1);

    return (
      <div className="stepsBar">
        <div className="stepsBar__step0">
          <div className="stepsBar__dot" data-tip={steps[0].name} />
        </div>

        {steps.slice(1, steps.length).map(({ name }, index) => (
          <div
            className={`stepsBar__step ${
              index < activeStepIndex ? "stepsBar__step_active" : ""
            }`}
            style={{ width: `${stepWidth}%` }}
          >
            <div className="stepsBar__dot" data-tip={name} />
            {/* {name} */}
          </div>
        ))}

        <ReactTooltip place="top" effect="solid" type="light" />
      </div>
    );
  }
}
