import { configure, addDecorator } from "@storybook/react";
import Center from "../stories/decorators/Center";
import { withBackgrounds } from "@storybook/addon-backgrounds";

function loadStories() {
  require("../stories/InputField.js");
  require("../stories/Button.js");
  // You can require as many stories as you need.
}

addDecorator(
  withBackgrounds([
    { name: "Grey", value: "#f5f6fa", default: true },
    {
      name: "Blue",
      value: "#3E85F3"
    }
  ])
);

addDecorator(Center);

configure(loadStories, module);
