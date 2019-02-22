// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import WrappedCheckBox from "./decorators/WrappedCheckBox";
import "styles/components/_checkbox.sass";

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions("onClick", "onChange");

storiesOf("CheckBox", module)
  .add("Default", props => {
    return <WrappedCheckBox {...props} {...eventsFromNames} />;
  })
  .add("With Text", props => {
    return (
      <WrappedCheckBox
        label="Only unique profiles"
        {...props}
        {...eventsFromNames}
      />
    );
  });
