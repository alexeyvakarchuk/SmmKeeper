// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import Button from "components/Button";
import "styles/base/_reset.sass";
import "styles/base/_colours.scss";
import "styles/components/_button.sass";

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions("onClick");

storiesOf("Button", module)
  .add("Default", props => {
    return <Button value={"Button"} />;
  })
  .add("Disabled", props => {
    return <Button value={"Button"} disabled />;
  });
