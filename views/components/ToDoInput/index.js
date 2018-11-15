// @flow
import React, { PureComponent } from "react";
import type { Props, State } from "./types";
import { addToDo } from "ducks/todolist";
import store from "store";

class ToDoInput extends PureComponent<Props, State> {
  state = {
    value: ""
  };

  handleInputChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value });
  };

  handleKeyPress = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      store.dispatch(addToDo({ name: this.state.value }));
      this.setState({ value: "" });
    }
  };

  render() {
    return (
      <div className="todo__input-field">
        <input
          placeholder="Add todo to the list..."
          value={this.state.value}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    );
  }
}

export default ToDoInput;
