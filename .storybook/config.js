import { configure, addDecorator } from "@storybook/react";
import Center from "../stories/decorators/Center";
import { withBackgrounds } from "@storybook/addon-backgrounds";
import "styles/storybook.sass";

function loadStories() {
  require("../stories/InputField.js");
  require("../stories/Button.js");
  require("../stories/Select.js");
  require("../stories/StepsBar.js");
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
