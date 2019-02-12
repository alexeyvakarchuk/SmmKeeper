// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import WrappedInputField from "./decorators/WrappedInputField";
import User from "icons/User";
import "styles/components/_input-field.sass";

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions("onClick", "onChange");

storiesOf("InputField", module)
  .add("Default", props => {
    return (
      <WrappedInputField inputName="Username" {...props} {...eventsFromNames} />
    );
  })
  .add("With Icon", props => {
    return (
      <WrappedInputField
        inputName="Username"
        icon={<User />}
        {...props}
        {...eventsFromNames}
      />
    );
  });
