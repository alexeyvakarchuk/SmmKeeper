// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import WrappedSelect from "./decorators/WrappedSelect";
import "styles/components/_select.sass";

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions("onClick");

storiesOf("Select", module).add("Default", props => {
  const options = [
    { value: "Follow", label: "Follow" },
    { value: "Follow & Like", label: "Follow & Like" },
    { value: "Like", label: "Like" },
    { value: "Unfollow", label: "Unfollow" }
  ];

  return (
    <WrappedSelect
      instanceId="dropdown-1"
      placeholder="Select something..."
      options={options}
    />
  );
});
