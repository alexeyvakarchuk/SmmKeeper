// @flow

import React from "react";
import { storiesOf } from "@storybook/react";
import InputField from "components/InputField";
import "styles/main.sass";

storiesOf("InputField", module).add("with text", () => {
  let inputValue = "abc";

  const handleChange = (value: string) => {
    inputValue = value;
    console.log(inputValue);
  };

  return (
    <InputField
      inputName="Input name"
      inputValue={inputValue}
      handleChange={handleChange}
    />
  );
});
// .add("with some emoji", () => (
//   <Button>
//     <span role="img" aria-label="so cool">
//       😀 😎 👍 💯
//     </span>
//   </Button>
// ));
